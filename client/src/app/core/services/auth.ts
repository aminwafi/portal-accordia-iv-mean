import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs'; 
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  public user: User | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      return payload.role ?? null;
    } catch (err) {
      return null;
    }
  }

  setUser(user: User) {
    this.user = user;
  }

  clearUser() {
    this.user = null;
  }

  initUser() {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = this.decodeToken(token);

      this.user = {
        id: payload.userId,
        username: payload.username
      };
    } catch {
      this.clearUser();
      localStorage.removeItem('access_token');
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) return true;

    const payload = this.decodeToken(token);
    const now = Math.floor(Date.now() / 1000);

    return payload.exp < now;
  }

  register(data: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { identifier: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data)
    .pipe(tap(res => {
      localStorage.setItem('access_token', res.token);

      const payload = this.decodeToken(res.token);;

      this.setUser({
        id: payload.userId,
        username: payload.username
      });
    }));
  }

  verify(code: string, otpToken: string) {
    return this.http.post(`${this.apiUrl}/verify`, { code }, {
      headers: { Authorization: `Bearer ${otpToken}` }
    }).pipe(tap((res: any) => {
        localStorage.setItem('access_token', res.token);

        const payload = this.decodeToken(res.token);

        this.setUser({
          id: payload.userId,
          username: payload.username
        });
    }));
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    alert('Logout successful');
    this.router.navigate(['/home']);
  }
}
