import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';

import { fakeBackendProvider } from './auth/fake-backend';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { routing } from './app.routing';
import { AdminComponent } from './components/admin/admin.component';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { MapComponent } from './components/map/map.component';
import { LibraryCardComponent } from './components/admin/library-card/library-card.component';
import { LibraryComponent } from './components/admin/library/library.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    AdminComponent,
    WellcomeComponent,
    MapComponent,
    LibraryCardComponent,
    LibraryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCau6_koBHjV8it4a5F1AGj1OQjgojI1B8'
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
