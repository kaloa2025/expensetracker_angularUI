import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken? : string;
  user?: {
    id: number;
    userName: string;
    email: string;
    role : string;
  };
  message?: string;
  errors?: string[];
}

export interface LoginRequest
{
  email:string;
  password:string;
}

export interface SignUpRequest
{
  username:string;
  email:string;
  password:string;
  repassword:string;
}

export interface EditProfileRequest
{
  username:string;
  email:string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) {
    // this.loadUserFromStorage();
  }

  login(credentials:LoginRequest):Observable<LoginResponse>
  {
    return this.http.post<LoginResponse>('/api/auth/login', credentials);
  }

  // private tokenKey = 'auth_token';
  // private userSubject = new BehaviorSubject<any>(null);

  // login(email: string, password: string): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>('/api/auth/login', { email, password })
  //     .pipe(
  //       tap(response => {
  //         localStorage.setItem(this.tokenKey, response.token);
  //         localStorage.setItem('user', JSON.stringify(response.user));
  //         this.userSubject.next(response.user);
  //       })
  //     );
  // }

  // isAuthenticated(): boolean {
  //   const token = localStorage.getItem(this.tokenKey);
  //   return !!token && !this.isTokenExpired(token);
  // }

  // private isTokenExpired(token: string): boolean {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     return payload.exp * 1000 < Date.now();
  //   } catch {
  //     return true;
  //   }
  // }

  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   localStorage.removeItem('user');
  //   this.userSubject.next(null);
  // }

  // private loadUserFromStorage(): void {
  //   const user = localStorage.getItem('user');
  //   if (user && this.isAuthenticated()) {
  //     this.userSubject.next(JSON.parse(user));
  //   }
  // }
}


/*
// auth.service.ts (continued)

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private sessionTimeoutWarning$ = new Subject<void>();
  private sessionExpired$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
    this.setupSessionMonitoring();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.storeAuthData(response.token, response.refreshToken!, response.user!);
          }
        })
      );
  }

  private storeAuthData(token: string, refreshToken: string, user: UserInfo): void {
    // Store in memory for security (or localStorage if needed)
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('user_info', JSON.stringify(user));
    
    this.currentUserSubject.next(user);
    this.startSessionTimer(token);
  }

  private loadStoredAuth(): void {
    const token = sessionStorage.getItem('access_token');
    const userInfo = sessionStorage.getItem('user_info');
    
    if (token && userInfo && !this.isTokenExpired(token)) {
      const user = JSON.parse(userInfo);
      this.currentUserSubject.next(user);
      this.startSessionTimer(token);
    } else {
      this.logout();
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getClaims(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roles.includes(role) ?? false;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
*/

/*
Session 

// auth.service.ts (session management methods)
private sessionTimer?: any;
private readonly SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

private startSessionTimer(token: string): void {
  this.clearSessionTimer();
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiryTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeToExpiry = expiryTime - currentTime;
  
  if (timeToExpiry > this.SESSION_WARNING_TIME) {
    // Set warning timer
    setTimeout(() => {
      this.sessionTimeoutWarning$.next();
    }, timeToExpiry - this.SESSION_WARNING_TIME);
  }
  
  // Set expiry timer
  this.sessionTimer = setTimeout(() => {
    this.handleSessionExpiry();
  }, timeToExpiry);
}

private handleSessionExpiry(): void {
  this.sessionExpired$.next();
  this.logout();
}

getSessionWarning$() {
  return this.sessionTimeoutWarning$.asObservable();
}

getSessionExpired$() {
  return this.sessionExpired$.asObservable();
}

extendSession(): Observable<boolean> {
  const refreshToken = sessionStorage.getItem('refresh_token');
  if (!refreshToken) return of(false);
  
  return this.http.post<{token: string, refreshToken: string}>('/api/auth/refresh', {
    refreshToken
  }).pipe(
    map(response => {
      sessionStorage.setItem('access_token', response.token);
      sessionStorage.setItem('refresh_token', response.refreshToken);
      this.startSessionTimer(response.token);
      return true;
    }),
    catchError(() => {
      this.logout();
      return of(false);
    })
  );
}

logout(): void {
  this.clearSessionTimer();
  sessionStorage.clear();
  this.currentUserSubject.next(null);
  this.router.navigate(['/login']);
}

private clearSessionTimer(): void {
  if (this.sessionTimer) {
    clearTimeout(this.sessionTimer);
    this.sessionTimer = undefined;
  }
}
*/

/*
// auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token && !this.isAuthEndpoint(req.url)) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/register');
  }
}

// app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
*/