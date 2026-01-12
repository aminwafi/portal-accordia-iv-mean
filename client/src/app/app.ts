import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { AuthService } from './core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule
  ],
  standalone: true,
  templateUrl: './app.html',
  // styleUrl: './app.scss'
})
export class App {
  constructor(public auth: AuthService ) {
      this.auth.initUser();
  }
  protected readonly title = signal('client');
}
