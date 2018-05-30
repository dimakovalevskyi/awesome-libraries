import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Library } from '../../../models/library';
import { LibraryService } from '../../../services/library.service';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'app-library-card',
  templateUrl: './library-card.component.html',
  styleUrls: ['./library-card.component.scss']
})
export class LibraryCardComponent implements OnInit {
  @Input() lib: Library;
  @Output() itemRemoved = new EventEmitter<Array<Library>>();

  constructor(
    private libService: LibraryService,
    private confirmation: ConfirmationService
  ) { }

  edit() {
    this.libService.edit(this.lib.id)
      .then(data => this.lib = data ? data : this.lib);
  }

  remove() {
    this.confirmation.open('Ви впевнені що хочете видалити бібліотеку?')
      .then(() => this.libService.remove(this.lib.id))
      .then(data => this.itemRemoved.emit(data))
      .catch(() => {});
  }

  ngOnInit() {
  }

}
