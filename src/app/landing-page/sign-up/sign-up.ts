import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { SignUpRequest } from '../../../services/auth/auth.models';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;
  isLoading = false;
  apiErrors: string[] = [];
  successMessage = '';

  passwordValidations = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(private authService : AuthService){}

  validatePassword() {
    const pwd = this.password || '';
    this.passwordValidations.length = pwd.length >= 6;
    this.passwordValidations.upper = /[A-Z]/.test(pwd);
    this.passwordValidations.lower = /[a-z]/.test(pwd);
    this.passwordValidations.number = /[0-9]/.test(pwd);
    this.passwordValidations.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  }

  allPasswordValidationsMet() {
    return Object.values(this.passwordValidations).every(Boolean);
  }

  get usernameValid() {
    return this.username.length > 3 && this.username.length <= 15;
  }

  get passwordsMatch() {
    return this.password && this.confirmPassword && this.password === this.confirmPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    this.submitted = true;
    this.apiErrors = [];
    this.successMessage = '';
  
    if (
      this.usernameValid &&
      this.email &&
      this.isValidEmail(this.email) &&
      this.allPasswordValidationsMet() &&
      this.passwordsMatch
    ) {
      this.callSignUpAPI();
    }
  }

  private callSignUpAPI()
  {
    this.isLoading = true;
    const signUpRequest:SignUpRequest={
      userName : this.username,
      email : this.email,
      password : this.password,
      rePassword : this.confirmPassword
    };

    this.authService.signUp(signUpRequest).subscribe
    ({
      next:(response)=>{
        this.isLoading = false;
        if(response.success)
        {
          this.successMessage = response.message || 'Account created successfully!';
          //navigate to login for that user
          setTimeout(()=>{
            this.resetForm();
          },2000);
        }
        else
        {
          this.apiErrors = response.errors || [response.message||'Signup failed! Try again later'];
        }
      },

      error:(error)=>{
        this.isLoading = false;
        if (error.error && error.error.errors) {
          this.apiErrors = error.error.errors;
        } else if (error.error && error.error.message) {
          this.apiErrors = [error.error.message];
        } else {
          this.apiErrors = ['An unexpected error occurred. Please try again.'];
        }
      }
    });
  }

  private resetForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.submitted = false;
    this.passwordValidations = {
      length: false,
      upper: false,
      lower: false,
      number: false,
      special: false
    };
  }
}