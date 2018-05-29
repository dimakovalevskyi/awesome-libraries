import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Library } from '../models/library';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Promise<Array<Library>> {
    return this.http.get<any>('/api/libraries')
      .toPromise()
      .then(data => data.libraries)
      // todo console.error => snack bar
      .catch(error => console.error(error));
  }

  get(id: number|string): Promise <Library> {
    return this.http
      .get<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .then(data => data.library)
      .catch(error => console.error(error));
  }
}
