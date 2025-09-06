import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { LoginComponent } from './login/login';
import { RegisterUserComponent } from './register-user/register-user';

export const AuthenticationRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'register-user', component: RegisterUserComponent }
];
