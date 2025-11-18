import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    constructor(private auth:AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>
    {
        const token = localStorage.getItem('accessToken');
        let authReq = req;
        if(token)
        {
            authReq = req.clone({
                setHeaders:{Authorization: `Bearer ${token}`}
            });
        }

        const isAuthRequest =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/signup') ||
        req.url.includes('/auth/refresh');

        if (isAuthRequest) {
        return next.handle(authReq);
        }


        return next.handle(authReq).pipe(
            catchError(err=>{
                if(err instanceof HttpErrorResponse && err.status === 401)
                {
                    return this.auth.refreshTokenRequest().pipe(
                        switchMap(newToken=>{
                            if(!newToken)
                            {
                                return throwError(()=>err);
                            }
                            const retryReq = req.clone({
                                setHeaders:{Authorization:`Bearer ${newToken}`}
                            });
                            return next.handle(retryReq);
                        }),
                        catchError(refreshErr=>{
                            this.auth.logout(true);
                            return throwError(()=>refreshErr);
                        })
                    );
                }
                return throwError(()=>err);
            })
        )
    }
}