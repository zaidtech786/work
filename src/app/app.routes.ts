import { Routes } from '@angular/router';
import { AuthenticationRoutes } from './authentication/authentication.routes';
import { DashboardRoutes } from './admin/dashboard.routes';
import { AuthGuard } from '../app/guards/auth.guard'; // ✅ import guard

export const routes: Routes = [
    {
        path: '',
        children: AuthenticationRoutes   // your existing auth routes
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],        // ✅ protect dashboard
        children: DashboardRoutes
    }
];
