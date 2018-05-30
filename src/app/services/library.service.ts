import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Library } from '../models/library';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LibraryEditDialogComponent } from '../components/admin/library-edit-dialog/library-edit-dialog.component';
import { ImportComponent } from '../components/import/import.component';

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
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  protected getForExport(): Promise<Array<Library>> {
    return this.http.get<any>('/api/export')
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  get(id: number|string): Promise <Library> {
    return this.http
      .get<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  edit(id: number|string) {
    return this.get(id)
      .then(library => this.dialog.open(LibraryEditDialogComponent, {
        width: '550px',
        data: library
      }).afterClosed().toPromise())
      .then(result => {
        if (result) {
          return this.update(result);
        }
        return null;
    });
  }

  update(library) {
    return this.http
      .patch<any>('/api/libraries', library)
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  add() {
    return this.dialog.open(LibraryEditDialogComponent, {
      width: '550px',
      data: null
    }).afterClosed().toPromise()
    .then(result => {
      if (result) {
        return this.http
          .post<any>('/api/libraries', result)
          .toPromise()
          .catch(error => this.snackBar.open(error.message, 'Закрити'));
      }
    });
  }

  remove(id: number|string) {
    return this.http
      .delete<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  export(song?) {
    this.getForExport()
      .then(data => {
        const fileName = 'Awesome_libraries_export';
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        const dlAnchorElem = document.getElementById('downloadHelperElement');

        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', fileName + '.json');
        dlAnchorElem.click();
      });
  }

  import() {
    return this.dialog.open(ImportComponent, {
        width: '300px'
      }).afterClosed().toPromise()
      .then(result => {
        if (result) {
          return this.http
            .post<any>('/api/import', result)
            .toPromise()
            .catch(error => this.snackBar.open(error.message, 'Закрити'));
        }
      });
  }

}
