import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { SignUpRequest } from '../../../services/auth/auth.models';
import { Router } from '@angular/router';
import { Subscription, timeout } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnDestroy {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;
  isLoading = false;
  apiErrors: string[] = [];
  successMessage = '';

  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage = '';

  countdown = 0;
  timeoutMs = 15000; // 15 seconds
  private countdownInterval: any;
  private apiSub?: Subscription;
  private hidePopupTimer?: any;

  passwordValidations = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(private router: Router, private authService : AuthService){}

  ngOnDestroy(): void {
    this.clearCountdown();
    this.clearPopupTimer();
    if (this.apiSub) this.apiSub.unsubscribe();
  }

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
    return this.username.length >=3 && this.username.length <= 15;
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
  
    if (
      this.usernameValid &&
      this.email &&
      this.isValidEmail(this.email) &&
      this.allPasswordValidationsMet() &&
      this.passwordsMatch
    ) 
    {
      this.callSignUpAPI();
    }
  }

  private callSignUpAPI()
  {
    this.isLoading = true;
    this.countdown = this.timeoutMs / 1000;
    this.startCountdown();
    
    const signUpRequest:SignUpRequest={
      userName : this.username,
      email : this.email,
      password : this.password,
      rePassword : this.confirmPassword
    };

    this.apiSub = this.authService
      .signUp(signUpRequest)
      .pipe(timeout(this.timeoutMs))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.clearCountdown();

          if (response.success) {
            this.successMessage = response.message || 'Account created successfully!';
            this.showSuccess(this.successMessage);

            setTimeout(() => {
              this.router.navigate(['/dashboard/overview']);
            }, 1200);
          }
          else {
            const err = response.errors || [response.message || 'Signup failed. Try again later.'];
            this.apiErrors = err;
            this.showError(err.join(', '));
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.clearCountdown();

          const isTimeout =
            error?.name === 'TimeoutError' ||
            error?.message?.toLowerCase?.().includes('timeout');

          if (isTimeout) {
            this.showError('Request timed out. Please try again.');
            return;
          }

          if (error.error?.errors) {
            this.apiErrors = error.error.errors;
            this.showError(error.error.errors.join(', '));
          } else if (error.error?.message) {
            this.apiErrors = [error.error.message];
            this.showError(error.error.message);
          } else {
            this.apiErrors = ['Unexpected error occurred.'];
            this.showError('Unexpected error occurred.');
          }
        }
      });
  }
  private startCountdown() {
    this.clearCountdown();
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) this.clearCountdown();
    }, 1000);
  }

  private clearCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = null;
  }

  private showSuccess(msg: string) {
    this.successMessage = msg;
    this.showSuccessPopup = true;
    this.showErrorPopup = false;

    this.clearPopupTimer();
    this.hidePopupTimer = setTimeout(() => (this.showSuccessPopup = false), 2500);
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    this.showErrorPopup = true;
    this.showSuccessPopup = false;

    this.clearPopupTimer();
    this.hidePopupTimer = setTimeout(() => (this.showErrorPopup = false), 4000);
  }

  private clearPopupTimer() {
    if (this.hidePopupTimer) clearTimeout(this.hidePopupTimer);
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
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
      special: false,
    };
  }
}