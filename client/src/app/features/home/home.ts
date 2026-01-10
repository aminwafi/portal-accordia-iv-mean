import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  registerForm!: FormGroup;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ){

    this.registerForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(8)],
      confirmPassword: ['', Validators.required]
    });

    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    this.auth.register(this.registerForm.value).subscribe((result) => {
      console.log(result);
    })
  }

  login() {
    if (this.registerForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe((result) => {
      console.log(result);
    })
  }
}
