import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Library } from '../../../models/library';
import { LibraryService } from '../../../services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  library: Library;
  constructor(
    private route: ActivatedRoute,
    private libService: LibraryService
  ) { }

  removeBook(book) {
    this.library.books.splice(this.library.books.indexOf(book), 1);
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
