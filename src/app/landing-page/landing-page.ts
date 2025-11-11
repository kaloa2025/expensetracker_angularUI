import { Component } from '@angular/core';
import { CommonModule, NgIf } from "@angular/common";
import { SignIn } from "./sign-in/sign-in";
import { SignUp } from './sign-up/sign-up';
import { Router, ActivatedRoute, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

  currentMode: 'signin' | 'signup' = 'signin';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const child = this.route.firstChild;
      if (child && child.snapshot.url.length) {
        const mode = child.snapshot.url[0].path;
        this.currentMode = mode === 'signup' ? 'signup' : 'signin';
      }
    });
  }

  goTo(mode: 'signin' | 'signup') {
    if (this.currentMode !== mode) {
      this.router.navigate([mode], { relativeTo: this.route });
    }
  }

  onAuthSuccess(): void {
    this.router.navigate(['/dashboard']);
  }
  
}
