import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Library } from '../../../models/library';
import { LibraryService } from '../../../services/library.service';

@Component({
  selector: 'app-library-card',
  templateUrl: './library-card.component.html',
  styleUrls: ['./library-card.component.scss']
})
export class LibraryCardComponent implements OnInit {
  @Input() lib: Library;
  @Output() itemRemoved = new EventEmitter<Array<Library>>();

  constructor(
    private libService: LibraryService
  ) { }

  edit() {
    this.libService.edit(this.lib.id)
      .then(data => this.lib = data ? data : this.lib);
  }

  remove() {
    this.libService.remove(this.lib.id)
      .then(data => this.itemRemoved.emit(data));
  }

  ngOnInit() {
  }

}
