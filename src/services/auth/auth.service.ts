import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SignUpRequest, SignUpResponse } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7253/api';
  constructor(private http: HttpClient) {}
  signUp(signUpRequest: SignUpRequest):Observable<SignUpResponse>
  {
    const headers = new HttpHeaders({
      'Content-Type':'application/json'
    });
    return this.http.post<SignUpResponse>(`${this.apiUrl}/auth/signup`,signUpRequest, {headers});
  }
}