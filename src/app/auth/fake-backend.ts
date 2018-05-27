import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testUser = {
      id: 1,
      username: 'admin',
      password: 'admin',
      firstName: 'Super',
      lastName: 'Admin'
    };

    return of(null).pipe(mergeMap(() => {

      if (request.url.endsWith('/api/login') && request.method === 'POST') {
        if (request.body.username === testUser.username && request.body.password === testUser.password) {
          return of(new HttpResponse({ status: 200, body: { token: 'fake-jwt-token' } }));
        } else {
          return throwError('Username or password is incorrect');
        }
      }

      if (request.url.endsWith('/api/users') && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: [testUser] }));
        } else {
          return throwError('Unauthorised');
        }
      }

      return next.handle(request);

    }))
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
