import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Login service
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Login as login and password
   *
   * @param {string} username
   * @param {string} password
   * @memberof AuthService
   */
  login(username: string, password: string) {
    return this.http.post<any>('/api/login', { username: username, password: password })
      .pipe(map((res: any) => {
        if (res && res.token) {
          localStorage.setItem('currentUser', JSON.stringify({ username, token: res.token }));
        }
      }));
  }

  /**
   * Do logout
   *
   * @memberof AuthService
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  /**
   * Check if user is logginned now
   *
   * @returns {boolean}
   * @memberof AuthService
   */
  isLoggined() {
    return !!localStorage.getItem('currentUser');
  }
}
