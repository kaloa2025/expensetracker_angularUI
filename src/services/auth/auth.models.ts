export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
}

export interface SignUpResponse {
  success: boolean;
  token?: string;
  user?: UserDto;
  message?: string;
  errors?: string[];
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  role: string;
}

export interface JwtClaims
{
    userId: number;
    email: string;
    userName: string;
    role?: string;
}

export interface StoredUser {
  userId: string;
  userName: string;
  email: string;
  role?: string;
  token: string;
  tokenExpiry: Date;
}

export interface LoginRequest
{
  email:string;
  password:string;
}

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

export interface EditProfileRequest
{
  username:string;
  email:string;
}