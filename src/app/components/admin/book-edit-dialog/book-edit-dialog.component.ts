import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-book-edit-dialog',
  templateUrl: './book-edit-dialog.component.html',
  styleUrls: ['./book-edit-dialog.component.scss']
})
export class BookEditDialogComponent implements OnInit {
  addingMode = true;
  countOfBlocked = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public book: Book|null
  ) { }

  inc() {
    this.book.copies.push({
      returnDate: new Date().getTime()
    });
  }
  dec() {
    this.book.copies.pop();
  }

  getBlockedCopies(book: Book) {
    return book.copies.filter(element => element.returnDate > new Date().getTime()).length;
  }

  ngOnInit() {
    if (this.book) {
      this.book = {...this.book};
      this.countOfBlocked = this.getBlockedCopies(this.book);
      this.addingMode = false;
    } else {
      this.book = {
        name: '',
        author: '',
        coverUrl: '',
        isbn: '',
        year: 0,
        copies: [{
          returnDate: new Date().getTime()
        }]
      };
    }
  }

}
