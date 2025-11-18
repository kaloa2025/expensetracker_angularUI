import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { isTokenExpired } from "./jwt.helper";
import { firstValueFrom } from "rxjs";

@Injectable({providedIn:'root'})
export class AuthGuardService{
    constructor(private auth: AuthService, private router:Router)
    {}

    async canActivate(route:any, state:any):Promise<boolean|UrlTree>
    {
        const token = this.auth.accessToken;
        if(!token)
        {
            return this.router.createUrlTree(['/landingpage/signon'],{queryParams:{returnUrl:state.url}});
        }
        if(!isTokenExpired(token))
        {
            return true;
        }
        try
        {
            const newToken = await firstValueFrom(this.auth.refreshTokenRequest());
            if(newToken) return true;
            return this.router.createUrlTree(['/landingpage/signin'], { queryParams: { returnUrl: state.url }});
        }
        catch
        {
            return this.router.createUrlTree(['/landingpage/signin'], { queryParams: { returnUrl: state.url }});
        }
    }
}