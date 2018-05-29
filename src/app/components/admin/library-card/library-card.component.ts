import { Component, OnInit, Input } from '@angular/core';
import { Library } from '../../../models/library';
import { LibraryService } from '../../../services/library.service';

@Component({
  selector: 'app-library-card',
  templateUrl: './library-card.component.html',
  styleUrls: ['./library-card.component.scss']
})
export class LibraryCardComponent implements OnInit {
  @Input() lib: Library;

  constructor(
    private libService: LibraryService
  ) { }

  edit() {
    this.libService.edit(this.lib.id);
  }

  remove() {
    this.libService.remove(this.lib.id);
  }

  ngOnInit() {
  }

}
