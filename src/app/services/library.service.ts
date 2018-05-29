import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Library } from '../models/library';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LibraryEditDialogComponent } from '../components/admin/library-edit-dialog/library-edit-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  getAll(): Promise<Array<Library>> {
    return this.http.get<any>('/api/libraries')
      .toPromise()
      .then(data => data.libraries)
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  get(id: number|string): Promise <Library> {
    return this.http
      .get<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .then(data => data.library)
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  edit(id: number|string) {
    this.get(id)
      .then(library => this.dialog.open(LibraryEditDialogComponent, {
        width: '550px',
        data: library
      }).afterClosed().toPromise())
      .then(result => {
        if (result) {
          // update
        }
    });
  }

  remove(id: number|string) {

  }
}
