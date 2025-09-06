import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  showPassword = false;
  showSignupPassword = false;
  isLoading = false;
  isSigningUp = false;
  isFlipped = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void { }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleSignupPassword(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.access_token);
        this.snackBar.open(res.message || 'Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err?.error?.message || 'Login failed', 'Close', { duration: 3000 });
      },
    });
  }

  onSignup(): void {
    if (!this.signupForm.valid) {
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    this.isSigningUp = true;
    const { name, email, password } = this.signupForm.value;
    const svc: any = this.authService as any;

    if (typeof svc.register === 'function') {
      svc.register({ name, email, password }).subscribe({
        next: (res: any) => {
          this.isSigningUp = false;
          this.snackBar.open(res.message || 'Account created', 'Close', { duration: 3000 });
          this.isFlipped = false;
          this.loginForm.patchValue({ email });
        },
        error: (err: any) => {
          this.isSigningUp = false;
          this.snackBar.open(err?.error?.message || 'Signup failed', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.isSigningUp = false;
      this.snackBar.open('Signup endpoint not implemented', 'Close', { duration: 3000 });
    }
  }

  flipCard(event?: Event): void {
    if (event) event.preventDefault();
    this.isFlipped = !this.isFlipped;
  }

  private markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  socialLogin(provider: string): void {
    this.snackBar.open(`Social login with ${provider}`, 'Close', { duration: 3000 });
  }
}
