import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Library } from '../models/library';
import { MapComponent } from '../components/map/map.component';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  search(query: string): Promise<any> {
    return this.http
      .get<any>('/api/search', {
        params: new HttpParams().set('query', query)
      })
      .toPromise();
  }

  showOnMap(library: Library): void {
    this.dialog.open(MapComponent, {
      width: '600px',
      data: {
        coords: library.coordinates,
        height: 500
      }
    });
  }

  take(variant: {book: Book, library: Library}) {
    return this.http
      .post<any>('/api/take', variant)
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

}
