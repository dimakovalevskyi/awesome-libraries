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
import { CATCH_STACK_VAR } from '@angular/compiler/src/output/abstract_emitter';
import { Book } from '../models/book';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  database: any;

  constructor() {
    this.readFromLocalStorage();
    }

  databaseToArray() {
    const result = [];

    for (const library in this.database) {
      if (this.database.hasOwnProperty(library)) {
        result.push(this.database[library]);
      }
    }

    return result;
  }

  saveToLocalStorage() {
    const json = JSON.stringify(this.database);
    localStorage.setItem('awesome_libraries_data', json);
  }
  readFromLocalStorage() {
    const json = localStorage.getItem('awesome_libraries_data');
    try {
      this.database = JSON.parse(json);
    } catch (ignored) {}

    if (!this.database) {
      this.database = {};
    }
  }

  isValidLibrary(newLibrary) {
    return true;
  }

  addToDatabase(newLibrary) {
    if (!this.isValidLibrary(newLibrary)) {
      return false;
    }
    const keys = Object.keys(this.database);
    newLibrary.id = parseInt(keys[keys.length - 1], 10) + 1;

    this.database[newLibrary.id] = newLibrary;

    return true;
  }

  searchInDatabase(query: string) {
    const baseAsArray = this.databaseToArray();
    const allResult = [];

    function isBookMatch(book: Book) {
      if (book.name.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      if (book.author.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      if (book.isbn.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      return false;
    }
    function searchInLibrary(library: Library) {
      library.books
        .filter(isBookMatch)
        .forEach(result => allResult.push({
          library: library,
          book: result
        }));
    }

    baseAsArray.forEach(searchInLibrary);

    return allResult;
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

      if (request.url.endsWith('/api/export') && request.method === 'GET') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        return of(new HttpResponse({ status: 200, body: this.database }));
      }

      if (request.url.endsWith('/api/import') && request.method === 'POST') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        this.database = request.body;
        this.saveToLocalStorage();
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
        this.saveToLocalStorage();
        return of(new HttpResponse({ status: 200, body: this.database[request.body.id] }));
      }

      if (request.url.endsWith('/api/libraries') && request.method === 'POST') {
        if (request.headers.get('Authorization') !== 'Bearer fake-jwt-token') {
          return throwError({ message: 'Unauthorized requqest blocked' });
        }
        if (!this.addToDatabase(request.body)) {
          return throwError({ message: 'Bad request' });
        }
        this.saveToLocalStorage();
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
        this.saveToLocalStorage();
        return of(new HttpResponse({ status: 200, body: this.databaseToArray() }));
      }

      if (request.url.endsWith('/api/search') && request.method === 'GET') {
        if (!request.params.has('query')) {
          return throwError({ message: 'Bad request' });
        }
        if (request.params.get('query').length < 3) {
          return throwError({ message: 'Вибач, друже, але мінімальна довжина запиту 3 символи.' });
        }
        const response = this.searchInDatabase(request.params.get('query'));
        if (!response.length) {
          return throwError({ message: 'Нажаль, мені не вийшло нічого знайти за твоїм запитом. Спробуй змінити текст запиту.' });
        }
        return of(new HttpResponse({ status: 200, body: response }));
      }

      if (request.url.endsWith('/api/take') && request.method === 'POST') {
        if (!this.database[request.body.library.id]) {
          return throwError({ message: 'Not found' });
        }
        const variant = request.body;
        const index = variant.library.books.indexOf(variant.book);
        const now = new Date().getTime();
        variant.library.books[index].copies.find(copy => copy.returnDate <= new Date().getTime()).returnDate = now + 300000;
        this.database[variant.library.id] = variant.library;
        this.saveToLocalStorage();
        return of(new HttpResponse({ status: 200, body: JSON.stringify({
          library: {
            name: variant.library.name,
            address: variant.library.address
          },
          book: {
            name: variant.book.name,
            author: variant.book.author,
            year: variant.book.year,
            isbn: variant.book.isbn
          }
        }) }));
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
