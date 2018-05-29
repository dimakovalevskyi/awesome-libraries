import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Library } from '../models/library';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const database: Array<Library> = [{
      id: 0,
      name: 'Бібліотека ім. Стіва Джобса',
      address: 'Хрещатик',
      coordinates: {
        latitude: 50.450108,
        longitude: 30.524227
      },
      books: []
    }];
    const testUser = {
      id: 1,
      username: 'admin',
      password: 'admin'
    };

    return of(null).pipe(mergeMap(() => {

      if (request.url.endsWith('/api/login') && request.method === 'POST') {
        if (request.body.username === testUser.username && request.body.password === testUser.password) {
          return of(new HttpResponse({ status: 200, body: { token: 'fake-jwt-token' } }));
        } else {
          return throwError('Username or password is incorrect');
        }
      }
      if (request.url.endsWith('/api/libraries') && request.method === 'GET') {
        if (request.params.has('id')) {
          const result = database.filter(library => library.id.toString() === request.params.get('id'));
          if (result.length) {
            return of(new HttpResponse({ status: 200, body: {library: result[0]} }));
          } else {
            return of(new HttpErrorResponse({ status: 404 }));
          }
        }
        return of(new HttpResponse({ status: 200, body: {libraries: database} }));
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'POST') {
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // todo
          return of(new HttpResponse({ status: 200, body: {} }));
        } else {
          return throwError('Unauthorized requqest blocked');
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
