import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../services/auth/auth.models';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription, timeout } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit, OnDestroy {

  model = { email: '', password: '' };
  formSubmitted = false;
  isLoading = false;

  apiErrors: string[] = [];
  errorMessage = '';
  successMessage = '';

  showSuccessPopup = false;
  showErrorPopup = false;

  loginTimeoutMs = 15000;
  countdown = 0;

  private loginSub?: Subscription;
  private countdownInterval?: any;
  private hidePopupTimer?: any;

  constructor(private router: Router, private authService: AuthService) {}
  // Lifecycle Hooks
  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedLoginEmail');
    if (savedEmail) {
      this.model.email = savedEmail;
    }
  }

  ngOnDestroy(): void {
    this.clearLoginSubscription();
    this.clearCountdown();
    this.clearPopupTimer();
  }
  // Form Handling
  LogIn(form: NgForm) {
    this.formSubmitted = true;
    this.apiErrors = [];

    if (!this.validateForm()) return;

    localStorage.setItem('savedLoginEmail', this.model.email);
    this.callLoginAPI();
  }

  private validateForm(): boolean {
    if (!this.isValidEmail(this.model.email)) {
      this.showError('Please enter a valid email address.');
      return false;
    }

    if (!this.isValidPassword(this.model.password)) {
      this.showError('Password must be at least 4 characters.');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length > 4;
  }
  // API Call
  private callLoginAPI() {
    this.isLoading = true;
    this.errorMessage = '';
    this.clearLoginSubscription();

    this.startCountdown(Math.ceil(this.loginTimeoutMs / 1000));

    const request: LoginRequest = {
      email: this.model.email,
      password: this.model.password
    };

    this.loginSub = this.authService
      .logIn(request)
      .pipe(timeout(this.loginTimeoutMs))
      .subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
  }

  private handleSuccess(response: any) {
    this.isLoading = false;
    this.clearCountdown();

    if (!response?.success) {
      this.showError(response?.errors || 'Login failed. Please try again.');
      return;
    }

    this.successMessage =
      response.message || 'Welcome! You have logged in successfully.';
    this.showSuccess(this.successMessage);

    // navigate AFTER popup hides (better UX)
    setTimeout(() => {
      this.router.navigate(['/dashboard/overview']);
    }, 2500);
  }

  private handleError(err: any) {
    this.isLoading = false;
    this.clearCountdown();

    const isTimeout =
      err?.name === 'TimeoutError' ||
      err?.message?.toLowerCase?.().includes('timeout') ||
      err?.status === 0;

    if (isTimeout) {
      this.showError('Request timed out. Please try again.');
      return;
    }

    const message =
      err?.error?.message ||
      err?.message ||
      'Login failed. Please try again.';

    this.showError(message);
  }

  private startCountdown(seconds: number) {
    this.clearCountdown();
    this.countdown = seconds;

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) this.clearCountdown();
    }, 1000);
  }

  private clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
    this.countdown = 0;
  }
  // Subscriptions & Popup Control
  private clearLoginSubscription() {
    this.loginSub?.unsubscribe();
    this.loginSub = undefined;
  }

  private clearPopupTimer() {
    if (this.hidePopupTimer) {
      clearTimeout(this.hidePopupTimer);
      this.hidePopupTimer = undefined;
    }
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessPopup = true;
    this.showErrorPopup = false;

    this.clearPopupTimer();
    this.hidePopupTimer = setTimeout(() => {
      this.showSuccessPopup = false;
    }, 2500);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.showErrorPopup = true;
    this.showSuccessPopup = false;

    this.clearPopupTimer();
    this.hidePopupTimer = setTimeout(() => {
      this.showErrorPopup = false;
    }, 4000);
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.clearPopupTimer();
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
    this.clearPopupTimer();
  }

  redirectToPage()
  {
    this.router.navigate(['/forgot-password']);
  }
}
