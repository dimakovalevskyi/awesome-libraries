import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AdminComponent } from './components/admin/admin.component';
import { WellcomeComponent } from './components/wellcome/wellcome.component';

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
    path: 'chat',
    component: ChatComponent
  },

  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
