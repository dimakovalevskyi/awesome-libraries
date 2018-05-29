import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AdminComponent } from './components/admin/admin.component';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { LibraryComponent } from './components/admin/library/library.component';

const appRoutes: Routes = [
  {
    path: '',
    component: WellcomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/library/:id',
    component: LibraryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    component: ChatComponent
  },

  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
