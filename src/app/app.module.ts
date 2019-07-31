import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatProgressBarModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatStepperModule,
  MatCardModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatListModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { SheetJSComponent } from './sheetjs.component';

import {
  HttpService,
  AuthGuard,
  PermissionsGuard,
} from './services/services';

import {
  AppComponent,
  HomeComponent,
  DialogsComponent,
  LoginComponent,
  MenuComponent,
  OffersComponent,
  UsersComponent
} from './components';
import { CreateAdminComponent } from './create-admin/create-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogsComponent,
    LoginComponent,
    MenuComponent,
    OffersComponent,
    UsersComponent,
    CreateAdminComponent,
    SheetJSComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpService,
    AuthGuard,
    PermissionsGuard,
    Md5
  ],
  entryComponents: [
    DialogsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
