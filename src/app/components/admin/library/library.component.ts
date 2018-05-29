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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.libService.get(params.id)
        .then(data => this.library = data);
    });
  }

}
