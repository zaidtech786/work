import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
})
export class ForgotPasswordComponent {
  // flow control
  step = 1;

  // forms
  forgotForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;

  // ui flags
  showPassword = false; // (kept if you use a single toggle elsewhere)
  showNew = false;      // toggle "New Password"
  showConfirm = false;  // toggle "Confirm Password"

  // state
  email = '';
  otp = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });

    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ----- validators -----
  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // ----- step 1: request OTP -----
  onSendOtp() {
    if (this.forgotForm.invalid) return;
    this.email = this.forgotForm.value.email;

    console.log('📤 Sending OTP request for:', this.email);

    this.authService.sendOtp(this.email).subscribe({
      next: (res: any) => {
        console.log('✅ OTP Sent Response:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: res.message || 'OTP sent to your registered email',
        });
        this.step = 2;
      },
      error: (err: any) => {
        console.error('❌ OTP Send Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Failed to send OTP',
        });
      },
    });
  }

  // ----- step 2: verify OTP -----
  onVerifyOtp() {
    if (this.otpForm.invalid) return;
    this.otp = this.otpForm.value.otp;

    console.log('📤 Verifying OTP:', { email: this.email, otp: this.otp });

    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (res: any) => {
        console.log('✅ OTP Verified Response:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Verified',
          detail: res.message || 'OTP verified successfully',
        });
        this.step = 3;
      },
      error: (err: any) => {
        console.error('❌ OTP Verification Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid OTP',
          detail: err?.error?.message || 'OTP verification failed',
        });
      },
    });
  }

  // ----- step 3: reset password -----
  onResetPassword() {
    if (this.resetForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetForm.value;

    console.log('📤 Resetting password:', {
      email: this.email,
      otp: this.otp,
      newPassword: '••••••', // do not log actual password
      confirmPassword: '••••••',
    });

    this.authService.resetPassword(this.email, this.otp, newPassword, confirmPassword).subscribe({
      next: (res: any) => {
        console.log('✅ Password Reset Response:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Password Updated',
          detail: res.message || 'Password updated successfully',
        });

        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: any) => {
        console.error('❌ Password Reset Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Failed to reset password',
        });
      },
    });
  }

  // optional global toggle (if used elsewhere)
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
