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
  database: any = {
    0: {
      id: 0,
      name: 'Бібліотека ім. Стіва Джобса',
      address: 'Хрещатик',
      coordinates: {
        latitude: 50.450108,
        longitude: 30.524227
      },
      books: [{
        name: 'Гаррі Поттер та філософський камінь',
        author: 'Джоан Роулінг',
        year: 2000,
        isbn: 'GDS1251256136',
        coverUrl: 'https://vignette.wikia.nocookie.net/harrypotter/images/5/5d/VF3rqkkXZsk.jpg/revision/latest/top-crop/width/240/height/240?cb=20140331143558&path-prefix=ru',
        copies: []
      }]
    }
  };

  constructor() { }

  databaseToArray() {
    const result = [];

    for (const library in this.database) {
      if (this.database.hasOwnProperty(library)) {
        result.push(this.database[library]);
      }
    }

    return result;
  }

  isValidLibrary(newLibrary) {
    return true;
  }

  addToDatabase(newLibrary) {
    if (!this.isValidLibrary(newLibrary)) {
      return false;
    }
    const keys = Object.keys(this.database);
    newLibrary.id = keys[keys.length - 1] + 1;

    this.database[newLibrary.id] = newLibrary;

    return true;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
          return throwError({ message: 'Username or password is incorrect' });
        }
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'GET') {
        if (request.params.has('id')) {
          if (!this.database[request.params.get('id')]) {
            return throwError({ message: 'Not found' });
          }
          return of(new HttpResponse({ status: 200, body: this.database[request.params.get('id')] }));
        }
        return of(new HttpResponse({ status: 200, body: this.databaseToArray() }));
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'PATCH') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        if (!this.database[request.body.id]) {
          return throwError({ message: 'Not found' });
        }
        if (!this.isValidLibrary(request.body)) {
          return throwError({ message: 'Bad request' });
        }
        this.database[request.body.id] = request.body;
        return of(new HttpResponse({ status: 200, body: this.database[request.body.id] }));
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'POST') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        if (!this.addToDatabase(request.body)) {
          return throwError({ message: 'Bad request' });
        }
        return of(new HttpResponse({ status: 200, body: this.databaseToArray() }));
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'DELETE') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        if (!request.params.has('id')) {
          return throwError({ message: 'Bad request' });
        }
        if (!this.database[request.params.get('id')]) {
          return throwError({ message: 'Not found' });
        }
        delete this.database[request.params.get('id')];
        return of(new HttpResponse({ status: 200, body: this.databaseToArray() }));
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
