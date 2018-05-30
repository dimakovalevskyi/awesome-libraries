import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Library } from '../../../models/library';
import { LibraryService } from '../../../services/library.service';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  library: Library;
  constructor(
    private route: ActivatedRoute,
    private libService: LibraryService,
    private bookService: BookService
  ) { }

  addBook() {
    this.bookService.add()
      .then(result => {
        if (result) {
          this.saveChanges(result);
        }
      });
  }

  removeBook(book) {
    this.library.books.splice(this.library.books.indexOf(book), 1);
    this.saveChanges();
  }

  saveChanges(newBook?: Book) {
    if (newBook) {
      this.library.books.push(newBook);
    }
    this.libService.update(this.library)
      .then(library => this.library = library);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.libService.get(params.id)
        .then(data => this.library = data);
    });
  }

}
