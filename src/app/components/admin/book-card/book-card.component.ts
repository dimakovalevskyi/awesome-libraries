import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {
  @Input() book: Book;
  @Output() removeBook = new EventEmitter<Book>();

  constructor(
    private libService: LibraryService,
    private confirmation: ConfirmationService
  ) { }

  edit() {
    // this.libService.edit(this.lib.id)
    //   .then(data => this.lib = data ? data : this.lib);
  }

  remove() {
    this.confirmation.open('Ви впевнені що хочете видалити книгу?')
      .then(data => this.removeBook.emit(this.book))
      .catch(() => {});
  }

  ngOnInit() {
  }

}
