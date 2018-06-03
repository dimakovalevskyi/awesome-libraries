import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Library } from '../models/library';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LibraryEditDialogComponent } from '../components/admin/library-edit-dialog/library-edit-dialog.component';
import { ImportComponent } from '../components/import/import.component';

/**
 * Service for work with libraries
 *
 * @export
 * @class LibraryService
 */
@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  /**
   * Get all libraries from server
   *
   * @returns {Promise<Array<Library>>}
   * @memberof LibraryService
   */
  getAll(): Promise<Array<Library>> {
    return this.http.get<any>('/api/libraries')
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  /**
   * Get database for exporting in file
   *
   * @protected
   * @returns {Promise<Array<Library>>}
   * @memberof LibraryService
   */
  protected getForExport(): Promise<Array<Library>> {
    return this.http.get<any>('/api/export')
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  /**
   * Get library by id
   *
   * @param {(number|string)} id
   * @returns {Promise <Library>}
   * @memberof LibraryService
   */
  get(id: number|string): Promise <Library> {
    return this.http
      .get<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  /**
   * Open popup for editing library
   * When popup will be closed data will be updated on server
   *
   * @param {(number|string)} id
   * @returns {(Promise <Library|null>)}
   * @memberof LibraryService
   */
  edit(id: number|string): Promise <Library|null> {
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

  /**
   * Update information on server about library
   *
   * @param {Library} library
   * @returns {Promise <Library>}
   * @memberof LibraryService
   */
  update(library: Library): Promise <Library> {
    return this.http
      .patch<any>('/api/libraries', library)
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  /**
   * Open popup for adding library.
   * When popup will be closed data will be updated on server.
   *
   * @returns {Promise<Array<Library>>}
   * @memberof LibraryService
   */
  add(): Promise<Array<Library>> {
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

  /**
   * Remove library by id.
   *
   * @param {(number|string)} id
   * @returns {Promise<Array<Library>>}
   * @memberof LibraryService
   */
  remove(id: number|string): Promise<Array<Library>> {
    return this.http
      .delete<any>('/api/libraries', {
        params: new HttpParams().set('id', id.toString())
      })
      .toPromise()
      .catch(error => this.snackBar.open(error.message, 'Закрити'));
  }

  /**
   * Export all database in file
   *
   * @memberof LibraryService
   */
  export() {
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

  /**
   * Open popup for importing and import if file was selected
   *
   * @returns
   * @memberof LibraryService
   */
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
