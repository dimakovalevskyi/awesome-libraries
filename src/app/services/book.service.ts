import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BookEditDialogComponent } from '../components/admin/book-edit-dialog/book-edit-dialog.component';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  edit(book: Book) {
    return this.dialog.open(BookEditDialogComponent, {
      width: '550px',
      data: book
    }).afterClosed().toPromise();
  }

  add() {
    return this.dialog.open(BookEditDialogComponent, {
      width: '550px',
      data: null
    }).afterClosed().toPromise();
  }

  getBlockedCopies(book: Book) {
    return book.copies.filter(element => element.returnDate > new Date().getTime()).length;
  }

}
