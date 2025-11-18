import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { LoginRequest, SignUpRequest, SignUpResponse, LoginResponse, JwtClaims } from './auth.models';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { decodeJwt, getTokenExpiry, isTokenExpired } from './jwt.helper';

export interface AuthState {
  token: string;
  refreshToken?: string;
  claims: any;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'https://localhost:7253/api';

  private authStateSubject = new BehaviorSubject<AuthState|null>(null);
  authState$ = this.authStateSubject.asObservable();

  private refreshing = false;
  // emits new access token or null on failure
  private refreshSubject = new Subject<string|null>();

  private autoLogoutTimer?:any;
  private sessionWarningTimer:any;
  private warningSubject = new BehaviorSubject<number|null>(null);
  sessionWarning$ = this.warningSubject.asObservable();

  constructor(private http: HttpClient, private router:Router) 
  {
    this.loadFromStorage();
  }

  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http
      .post<SignUpResponse>(`${this.apiUrl}/auth/signup`, signUpRequest)
      .pipe(
        tap(res => {
          if (res.success && res.token) {
            this.setSession(res.token, undefined);  // store token
          }
        })
      );
  }

  private normalizeClaims(raw: any) {
    return {
      userId: raw["userId"] ??
              raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
              null,

      email: raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? null,

      userName: raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null,

      role: raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null,

      sessionId: raw["sessionId"] ?? null,
      exp: raw["exp"] ?? null,
      iat: raw["iat"] ?? null,
      raw
    };
  }


  logIn(logInRequest: LoginRequest):Observable<LoginResponse>
  {
    return this.http
    .post<LoginResponse>(`${this.apiUrl}/auth/login`,logInRequest)
      .pipe(
        tap((response)=>{
          if(response.success && response.token)
          {
            this.setSession(response.token, response.refreshToken);
          }
        })
    );
  }

   private setSession(token: string, refreshToken?: string) 
   {
    const rawClaims = decodeJwt(token) || {};
    const claims = this.normalizeClaims(rawClaims);
    
    const state: AuthState = { token, refreshToken, claims };
    localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userClaims', JSON.stringify(claims));
    this.authStateSubject.next(state);

    this.startAutoLogoutTimer(token);
  }


  logout(redirect = true)
  {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userClaims');
    localStorage.clear();
    this.authStateSubject.next(null);
    this.clearAutoLogoutTimer();

    if (redirect) {
      this.router.navigate(['/landingpage/signin'])
    }
  }

  private loadFromStorage()
  {
    const token = localStorage.getItem('accessToken');
    if(!token) return;
    if(isTokenExpired(token))
    {
       // try refresh immediately or clear session
      // We'll attempt refresh lazily when a request fails or call refresh now:
      // For simplicity here, we'll set state with decoded claims and still allow refresh later
      const claims = decodeJwt(token) || {};
      this.authStateSubject.next({ token, refreshToken: localStorage.getItem('refreshToken') || undefined, claims });
      // start timer if expiry exists to auto-logout
      this.startAutoLogoutTimer(token);
      return;
    }
    const claims = decodeJwt(token)||{};
    this.authStateSubject.next({token, refreshToken: localStorage.getItem('refreshToken')||undefined, claims});
    this.startAutoLogoutTimer(token);
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    const token = this.accessToken;
    return !!token && !isTokenExpired(token);
  }

  getClaims(): any | null {
    return this.authStateSubject.value?.claims ?? null;
  }

  getUserId(): string | number | null {
    const c = this.getClaims();
    return c?.sub ?? c?.userId ?? null;
  }

  get email(): string | null {
    return this.authStateSubject.value?.claims?.email ?? null;
  }

  get userName(): string | null {
    return this.authStateSubject.value?.claims?.userName ?? null;
  }

  get role(): string | null {
    return this.authStateSubject.value?.claims?.role ?? null;
  }


  // Refresh flow
  // - Single refresh attempt
  // - queue waiting requests by subscribing to refreshSubject

  refreshTokenRequest(): Observable<string> {
    // If already refreshing, return observable that waits for completion
    if (this.refreshing) {
      return this.refreshSubject.asObservable().pipe(
        switchMap(token => token ? of(token) : throwError(() => new Error('Refresh failed')))
      );
    }

    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    this.refreshing = true;
    // call server refresh endpoint
    return this.http.post<{ token: string; refreshToken?: string }>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(resp => {
        if (resp?.token) {
          // store new token + maybe new refreshToken
          this.setSession(resp.token, resp.refreshToken);
          // notify queued requests
          this.refreshSubject.next(resp.token);
        } else {
          this.refreshSubject.next(null);
        }
      }),
      catchError(err => {
        // notify failure
        this.refreshSubject.next(null);
        this.logout(true); // clear session
        return throwError(() => err);
      }),
      finalize(() => {
        this.refreshing = false;
        // complete and recreate subject so future refreshes have a fresh subject
        this.refreshSubject.complete();
        this.refreshSubject = new Subject<string | null>();
      }),
      switchMap(resp => of(resp.token))
    );
  }
  // Auto logout timer based on token exp
  
  private startAutoLogoutTimer(token: string) {
    this.clearAutoLogoutTimer();
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const msLeft = expiry - Date.now();
    if (msLeft <= 0) {
      this.logout(true);
      return;
    }

    const warningBeforeMs = 6000;

    // Schedule warning
    if (msLeft > warningBeforeMs) {
      this.sessionWarningTimer = setTimeout(() => {
        const secondsLeft = Math.floor((expiry - Date.now()) / 1000);
        this.warningSubject.next(secondsLeft); // Show popup
        this.startWarningCountdown(expiry);
      }, msLeft - warningBeforeMs);
    }

    // set timer to logout at expiry (optionally subtract a buffer for refresh)
    this.autoLogoutTimer = setTimeout(() => {
      // token expired; try to refresh automatically before forcing logout
      this.refreshTokenRequest().subscribe({
        next: () => {
          // refresh succeeded; nothing else to do (new timer is started by setSession)
        },
        error: () => {
          // refresh failed -> logout already called inside refreshTokenRequest
        }
      });
    }, msLeft);
  }

  private startWarningCountdown(expiryMs: number) {
    const interval = setInterval(() => {
      const secondsLeft = Math.floor((expiryMs - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        this.warningSubject.next(null);
      } else {
        this.warningSubject.next(secondsLeft);
      }
    }, 1000);
  }


  private clearAutoLogoutTimer() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = undefined;
    }
    if (this.sessionWarningTimer) {
      clearTimeout(this.sessionWarningTimer);
      this.sessionWarningTimer = null;
    }

    this.warningSubject.next(null); 
  }
}