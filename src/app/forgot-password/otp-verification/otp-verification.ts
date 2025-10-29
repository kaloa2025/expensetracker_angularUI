import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification implements OnInit, OnDestroy {
  form!: FormGroup;
  email: string = 'user@example.com';
  timer: number = 30;
  canResend: boolean = false;
  private timerInterval: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer() {
    this.canResend = false;
    this.timer = 30;
    
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onInput(event: any, nextInputId?: string) {
    const input = event.target;
    const value = input.value;

    // Only allow single digits
    if (value.length > 1) {
      input.value = value.slice(0, 1);
    }

    // Auto-focus next input
    if (value && nextInputId) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  getOtpValue(): string {
    const { digit1, digit2, digit3, digit4 } = this.form.value;
    return `${digit1 || ''}${digit2 || ''}${digit3 || ''}${digit4 || ''}`;
  }

  isFormValid(): boolean {
    return this.form.valid && this.getOtpValue().length === 4;
  }

  resend() {
    if (this.canResend) {
      alert("OTP resent successfully!");
      this.startTimer();
      this.form.reset();
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const otpValue = this.getOtpValue();
      alert("OTP verified successfully!");
      this.router.navigate(['/forgot-password/setup-new-password']);
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  }

  get formattedTimer(): string {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}