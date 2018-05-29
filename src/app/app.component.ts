import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  loading = false;

  constructor (
    public auth: AuthService,
    private loaderService: LoaderService
  ) {}

  isLoggined() {
    return this.auth.isLoggined();
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.loaderService.getSubject().subscribe(value => this.loading = value);
  }

}
