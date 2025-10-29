import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {

  constructor(private router: Router)
  {}
  redirectToPage()
  {
    this.router.navigate(['/forgot-password']);
  }

}
