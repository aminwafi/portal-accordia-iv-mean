import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `http://localhost:3000/api/auth`;

  constructor(private http: HttpClient) {}

  register(data: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { identifier: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  verify(code: string, token: string) {
    return this.http.post(`${this.apiUrl}/verify`, { code }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
