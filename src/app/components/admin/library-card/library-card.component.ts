import { Component, OnInit, Input } from '@angular/core';
import { Library } from '../../../models/library';

@Component({
  selector: 'app-library-card',
  templateUrl: './library-card.component.html',
  styleUrls: ['./library-card.component.scss']
})
export class LibraryCardComponent implements OnInit {
  @Input() lib: Library;

  constructor() { }

  viewDetails() {

  }

  edit() {

  }

  remove() {

  }

  ngOnInit() {
  }

}
