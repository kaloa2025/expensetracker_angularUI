import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './landing-page/sign-up/sign-up';
import { SignIn } from "./landing-page/sign-in/sign-in";
import { LandingPage } from './landing-page/landing-page';
import { SessionWarning } from "./session-warning/session-warning";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SessionWarning],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expensetracker_angularUI');
}
