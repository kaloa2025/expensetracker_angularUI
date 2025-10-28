import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, NgIf],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;

  passwordValidations = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

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
    return this.username.length > 0 && this.username.length <= 15;
  }

  get passwordsMatch() {
    return this.password && this.confirmPassword && this.password === this.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    
    // Check if form is valid
    if (
      this.usernameValid &&
      this.email &&
      this.isValidEmail(this.email) &&
      this.allPasswordValidationsMet() &&
      this.passwordsMatch
    ) {
      alert('Sign up successful!');
      this.resetForm();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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