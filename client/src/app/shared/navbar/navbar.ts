import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  isOpen = false;

  constructor(
    private auth: AuthService
  ) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.logout();
  }
}
