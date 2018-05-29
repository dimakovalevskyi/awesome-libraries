import { Injectable } from '@angular/core';
import { HttpEvent , HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoaderService {
  protected loading = false;
  private subject = new Subject<any>();

  constructor() {}

  show() {
    this.subject.next(true);
  }
  hide() {
    this.subject.next(false);
  }
  getSubject() {
    return this.subject.asObservable();
  }

}
