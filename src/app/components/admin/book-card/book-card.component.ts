import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { Library } from '../../../models/library';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {
  @Input() book: Book;
  @Input() library: Library;
  @Output() removeBook = new EventEmitter<Book>();
  @Output() saveChanges = new EventEmitter();

  constructor(
    private libService: LibraryService,
    private bookService: BookService,
    private confirmation: ConfirmationService
  ) { }

  edit() {
    this.bookService.edit(this.book)
      .then(result => {
        if (result) {
          const index = this.library.books.indexOf(this.book);
          this.library.books[index] = result;
          this.saveChanges.emit();
        }
      });
  }

  remove() {
    this.confirmation.open('Ви впевнені що хочете видалити книгу?')
      .then(data => this.removeBook.emit(this.book))
      .catch(() => {});
  }

  ngOnInit() {
  }

}
