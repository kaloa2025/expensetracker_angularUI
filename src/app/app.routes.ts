import { Routes } from '@angular/router';
// import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'landingpage',
        pathMatch:'full'
    },
    {
        path:'landingpage',
        loadComponent: () => import('./landing-page/landing-page').then(m => m.LandingPage),
        children: [
            {
                path: '',
                redirectTo: 'signin',
                pathMatch: 'full'
            },
            {
                path: 'signin',
                loadComponent: () => import('./landing-page/sign-in/sign-in').then(m => m.SignIn)
            },
            {
                path: 'signup',
                loadComponent: () => import('./landing-page/sign-up/sign-up').then(m => m.SignUp)
            }
        ]
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPassword),
        children: [
            {
                path: '',
                redirectTo: 'enter-email',
                pathMatch: 'full'
            },
            {
                path: 'enter-email',
                loadComponent: () => import('./forgot-password/enter-email/enter-email').then(m => m.EnterEmail)
            },
            {
                path: 'otp-verification',
                loadComponent: () => import('./forgot-password/otp-verification/otp-verification').then(m => m.OtpVerification)
            },
            {
                path: 'setup-new-password',
                loadComponent: () => import('./forgot-password/setup-new-password/setup-new-password').then(m => m.SetupNewPassword)
            }
        ]
    },
    {
        path:'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
        // canActivate: [AuthGuard],
        children:[
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
            },
            {
                path: 'overview',
                loadComponent: () => import('./dashboard/dashboard-overview/dashboard-overview').then(m => m.DashboardOverview)
            },
            {
                path:'imageupload',
                loadComponent: () => import('./dashboard/image-upload/image-upload').then(m => m.ImageUpload)
            },
            {
                path:'report',
                loadComponent: () => import('./dashboard/report/report').then(m => m.Report)
            },
            {
                path:'expense',
                loadComponent: () => import('./dashboard/expenses-gathered/expenses-gathered').then(m => m.ExpensesGathered)
            }
        ]
    },
    {
        path:'**',
        redirectTo:'landingpage'
    }
];
