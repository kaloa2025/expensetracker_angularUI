import { Injectable } from '@angular/core';
import { JwtClaims } from './auth/auth.models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(){}
  
  decodeToken(token:string):JwtClaims|null{
    try{
      return jwtDecode<JwtClaims>(token);
    }
    catch(error)
    {
      //Error decoding token
      console.log(error);
      return null;
    }
  }
  isTokenExpired(token:string):boolean
  {
    try
    {
      const claims=this.decodeToken(token);
      if(!claims) return true;
      const currentTime = Math.floor(Date.now()/1000);
    }
  }
  
}
