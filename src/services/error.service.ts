import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  
}

/*

// error.service.ts
@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new Subject<string>();
  public errors$ = this.errorSubject.asObservable();

  showError(message: string): void {
    this.errorSubject.next(message);
  }

  showErrors(errors: string[]): void {
    errors.forEach(error => this.showError(error));
  }
}

// error-interceptor.ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.errorService.showError('Session expired. Please login again.');
        } else if (error.status === 403) {
          this.errorService.showError('Access denied.');
        } else if (error.error?.errors) {
          this.errorService.showErrors(error.error.errors);
        } else if (error.error?.message) {
          this.errorService.showError(error.error.message);
        } else {
          this.errorService.showError('An unexpected error occurred.');
        }
        
        return throwError(() => error);
      })
    );
  }
}

// error-display.component.ts
@Component({
  selector: 'app-error-display',
  template: `
    <div *ngFor="let error of errors" class="alert alert-danger alert-dismissible">
      {{ error }}
      <button type="button" class="btn-close" (click)="removeError(error)"></button>
    </div>
  `
})
export class ErrorDisplayComponent implements OnInit {
  errors: string[] = [];

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.errors$.subscribe(error => {
      this.errors.push(error);
      // Auto-remove after 5 seconds
      setTimeout(() => this.removeError(error), 5000);
    });
  }

  removeError(error: string): void {
    this.errors = this.errors.filter(e => e !== error);
  }
}

*/