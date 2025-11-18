import { jwtDecode } from "jwt-decode";

export interface JwtPayload
{
    sub? : string | number;
    exp? : number;
    iat? : number;
    [key:string] : any;
}

export function decodeJwt(token : string):JwtPayload| null
{
    try
    {
        return jwtDecode<JwtPayload>(token);
    }
    catch
    {
        return null;
    }
}

export function getTokenExpiry(token:string):number| null
{
    const payload = decodeJwt(token);
    if(!payload?.exp) return null;
    return payload.exp*1000;
}

export function isTokenExpired(token : string, offsetSeconds = 0):boolean
{
    const expiry = getTokenExpiry(token);
    if(!expiry) return false;
    return Date.now() > expiry -offsetSeconds*1000;
}