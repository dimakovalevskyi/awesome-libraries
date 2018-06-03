import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BookEditDialogComponent } from '../components/admin/book-edit-dialog/book-edit-dialog.component';
import { Book } from '../models/book';

/**
 * Service for work with books
 *
 * @export
 * @class BookService
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  /**
   * Open popup for editing book
   *
   * @param {Book} book
   * @returns {Promise}
   * @memberof BookService
   */
  edit(book: Book) {
    return this.dialog.open(BookEditDialogComponent, {
      width: '550px',
      data: book
    }).afterClosed().toPromise();
  }

  /**
   * Open popup for adding book
   *
   * @returns {Promise}
   * @memberof BookService
   */
  add() {
    return this.dialog.open(BookEditDialogComponent, {
      width: '550px',
      data: null
    }).afterClosed().toPromise();
  }

  /**
   * Get count of book which are given and not exist in library
   *
   * @param {Book} book
   * @returns {number}
   * @memberof BookService
   */
  getBlockedCopies(book: Book) {
    return book.copies.filter(element => element.returnDate > new Date().getTime()).length;
  }

}
