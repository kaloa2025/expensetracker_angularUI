import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-enter-email',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './enter-email.html',
  styleUrl: './enter-email.css',
})
export class EnterEmail {
  form = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private router : Router){}

  onSubmit()
  {
    if(this.form.valid)
    {
      alert("form submitted");
      this.router.navigate(['forgot-password/otp-verification']);
    }
  }
}
