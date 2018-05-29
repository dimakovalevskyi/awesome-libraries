import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { Library } from '../../models/library';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  librariesList: Array<Library> = [];

  constructor(
    private libService: LibraryService
  ) { }

  addLibrary() {
    this.libService.add()
      .then(data => this.librariesList = data ? data : this.librariesList);
  }

  itemRemoved(newLibraryList) {
    this.librariesList = newLibraryList;
  }

  ngOnInit() {
    this.libService.getAll().then(data => this.librariesList = data);
  }

}
