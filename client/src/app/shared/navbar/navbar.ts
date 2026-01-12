import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  isMobile= false;

  constructor(
    private breakpoint: BreakpointObserver,
    public auth: AuthService
  ) {}

  ngAfterViewInit() {
    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;

      this.sidenav.mode = this.isMobile ? 'over' : 'side';

      setTimeout(() => {
        this.sidenav.close();
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.sidenav.close();
    this.auth.logout();
  }
}
