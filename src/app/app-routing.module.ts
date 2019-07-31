import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  HomeComponent, LoginComponent, OffersComponent, UsersComponent
} from './components';
import {
  AuthGuard, PermissionsGuard
} from './services/services';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [ AuthGuard, PermissionsGuard ]
  },
  {
    path: 'ofertas',
    component: OffersComponent,
    canActivate: [ AuthGuard, PermissionsGuard ]
  },
  {
    path: 'usuarios',
    component: UsersComponent,
    canActivate: [ AuthGuard, PermissionsGuard ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
