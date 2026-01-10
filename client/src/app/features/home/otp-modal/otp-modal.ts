import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-modal.html',
  styleUrl: './otp-modal.scss',
})
export class OtpModalComponent {
  @Output() verified = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isVerifying = false;
  error: string | null = null;

  otpForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  });

  constructor(private auth: AuthService) {}

  verify(): void {
    this.error = null;

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const token = sessionStorage.getItem('verify_token');
    if (!token) {
      this.error = 'Verification expired. Please login again';
      return;
    }

    this.isVerifying = false;

    this.auth
    .verify(this.otpForm.value.code!, token)
    .pipe(finalize(() => (this.isVerifying = false)))
    .subscribe({
      next: (res: any) => {
        sessionStorage.removeItem('verify_token');
        localStorage.setItem('access_token', res.accessToken);
        this.verified.emit();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Invalid OTP';
      }
    })
  }
}
