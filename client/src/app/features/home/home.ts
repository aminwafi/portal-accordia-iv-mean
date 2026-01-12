import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { finalize } from 'rxjs';
import { OtpModalComponent } from './otp-modal/otp-modal';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    OtpModalComponent,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  registerForm!: FormGroup;
  loginForm!: FormGroup;

  isRegistering = false;
  isLoggingIn = false;

  registerError: string | null = null;
  loginError: string | null = null;

  activeTab: 'register' | 'login' = 'register';

  showRegisterPassword = false;
  showRegisterConfirmPassword = false;
  showLoginPassword = false;

  showOtpModal = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ){

    this.registerForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;
    return password == confirmPassword ? null : { passwordMismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value as string;

    if (!password) return null;

    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
    }

    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = true;
    }

    if (!/[0-9]/.test(password)) {
      errors['number'] = true;
    }

    if (!/[#?!@$%^&*-]/.test(password)) {
      errors['special'] = true;
    }

    if (/\s/.test(password)) {
      errors['space'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  register(): void {
    this.registerError = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isRegistering = true;

    const payload = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.auth.register(payload)
    .pipe(finalize(() => (this.isRegistering = false)))
    .subscribe(({ 
      next: (res: any) => {
      this.registerForm.reset();
      alert(`Registration successful`);
      this.openOtp(res.token);
    },
    error: (err) => {
      console.error(err);
      this.registerError = err?.error?.message || 'Registration failed. Please try again'
    },
    }));
  }

  login(): void {
    this.loginError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    };

    this.isLoggingIn = true;

    this.auth.login(this.loginForm.value)
    .pipe(finalize(() => (this.isLoggingIn = false)))
    .subscribe({
      next: () => {
        alert('Login successful');
        this.router.navigate(['/item'], { replaceUrl: true })
      },
      error: (err) => {
        console.error(err);
        this.loginError =
          err?.error?.message || 'Invalid credentials'

        if (err?.error?.message === 'User not verified') {
          this.openOtp(err?.error?.token);
          return;
        }
      }
    })
  }

  switchTab(tab: 'register' | 'login') {
    if (this.activeTab === tab) return;

    this.activeTab = tab;

    this.registerForm.reset();
    this.loginForm.reset();

    this.registerError = null;
    this.loginError = null;

    this.isRegistering = false;
    this.isLoggingIn = false;

    this.showRegisterPassword = false;
    this.showRegisterConfirmPassword = false;
    this.showLoginPassword = false;
  }

  openOtp(token: string) {
    sessionStorage.setItem('verify_token', token);
    this.showOtpModal = true;
  }

  closeOtp() {
    this.showOtpModal = false;
  }

  onOtpVerified() {
    this.showOtpModal = false;
    this.loginError = null;
    this.loginForm.reset();
    alert('Account verified successfully');
  }

  get rf() {
    return this.registerForm.controls;
  }

  get lf() {
    return this.loginForm.controls;
  }
}
