import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth'; // backend base URL

    constructor(private http: HttpClient) { }

    // Login
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }

    // Forgot Password - send OTP
    sendOtp(email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
    }

    // Verify OTP
    verifyOtp(email: string, otp: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/verify-otp`, { email, otp });
    }

    // Reset Password
    resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/reset-password`, {
            email,
            otp,
            newPassword,
            confirmPassword,
        });
    }

    // Validate Token
    validateToken(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/validate`);
    }
}
