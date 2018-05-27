import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string) {
    return this.http.post<any>('/api/login', { username: username, password: password })
      .pipe(map((res: any) => {
        if (res && res.token) {
          localStorage.setItem('currentUser', JSON.stringify({ username, token: res.token }));
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  isLoggined() {
    return !!localStorage.getItem('currentUser');
  }
}
