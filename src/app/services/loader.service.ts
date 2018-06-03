import { Injectable } from '@angular/core';
import { HttpEvent , HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

/**
 * Service for manipulating with loader
 *
 * @export
 * @class LoaderService
 */
@Injectable()
export class LoaderService {
  protected loading = false;
  private subject = new Subject<any>();

  constructor() {}

  /**
   * Show preloader
   *
   * @memberof LoaderService
   */
  show() {
    this.subject.next(true);
  }

  /**
   * Hide preloader
   *
   * @memberof LoaderService
   */
  hide() {
    this.subject.next(false);
  }

  /**
   * Get subject to subscribe on showing/hiding loader
   *
   * @returns
   * @memberof LoaderService
   */
  getSubject() {
    return this.subject.asObservable();
  }

}
