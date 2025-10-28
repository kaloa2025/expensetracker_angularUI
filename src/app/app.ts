import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './landing-page/sign-up/sign-up';
import { SignIn } from "./landing-page/sign-in/sign-in";
import { LandingPage } from './landing-page/landing-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expensetracker_angularUI');
}
