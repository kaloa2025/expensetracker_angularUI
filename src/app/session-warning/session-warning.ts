import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-session-warning',
  imports: [CommonModule],
  templateUrl: './session-warning.html',
  styleUrl: './session-warning.css',
})
export class SessionWarning implements OnInit{

  secondsLeft:number|null=null;
  constructor(private auth:AuthService)
  {}

  ngOnInit(): void {
    this.auth.sessionWarning$.subscribe(seconds =>
    {
      this.secondsLeft = seconds;
    });
  }

  extendSession()
  {
    this.auth.refreshTokenRequest().subscribe({
      next:()=>{
        this.secondsLeft = null;
      },
      error:()=>{
        this.auth.logout(true);
      }
    });
  }

  logoutNow()
  {
    this.auth.logout(true);
  }

}
