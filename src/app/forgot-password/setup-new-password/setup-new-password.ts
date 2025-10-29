import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-setup-new-password',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './setup-new-password.html',
  styleUrl: './setup-new-password.css',
})
export class SetupNewPassword {
  constructor(private router : Router){}
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

  get passwordsMatch() {
    return this.password && this.confirmPassword && this.password === this.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    
    if (
      this.allPasswordValidationsMet() &&
      this.passwordsMatch
    ) {
      alert('New password added successfuly!');
      this.resetForm();
      this.router.navigate(['/dashboard/dashboard-overview']);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm() {
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
