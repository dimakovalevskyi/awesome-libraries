import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Library, LibraryCoordinates } from '../../../models/library';

@Component({
  selector: 'app-library-edit-dialog',
  templateUrl: './library-edit-dialog.component.html',
  styleUrls: ['./library-edit-dialog.component.scss']
})
export class LibraryEditDialogComponent implements OnInit {
  addingMode = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public library: Library|null
  ) { }

  cursorMoved(newCoords: LibraryCoordinates) {
    this.library.coordinates = newCoords;
  }

  ngOnInit() {
    if (this.library) {
      this.library = {...this.library};
      this.addingMode = false;
    } else {
      this.library = {
        id: -1,
        name: '',
        address: '',
        coordinates: {
          latitude: 50.450108,
          longitude: 30.524227
        },
        books: []
      };
    }
  }

}
