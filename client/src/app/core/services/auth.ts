import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  register(data: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { identifier: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(tap(res => localStorage.setItem('access_token', res.token)));
  }

  verify(code: string, token: string) {
    return this.http.post(`${this.apiUrl}/verify`, { code }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    alert('Logout successful');
    this.router.navigate(['/home']);
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch (err) {
      return null;
    }
  }

}
