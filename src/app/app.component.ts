import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { DialogsComponent } from './dialogs/dialogs.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { HttpService } from './services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userInfo: {
    id: string,
    names: string,
    lastNames: string,
    img: string,
    type: number,
    email: string,
    dataStudent?: {
      idNumber: string,
      career: string,
      isFree: number,
      teacherAssignment: number,
      cellphone: string,
      phone: string,
      address: string,
      schedule: string,
      hv: string,
      cardid: string,
      eps: string,
      enrollment: string,
      practice: string,
      convenioPractica: string,
      actaPractica: string,
      cumplimientoPractica: string,
      evaluacionPractica: string,
      informeFinalPractica: string,
      avanceMensual: string[],
      seguimientoAsesoria: string[]
    },
    dataCompany?: {
      name: string,
      razon: string,
      nit: string,
      address: string,
      phone: string,
      commerce: string,
      rut: string,
      cardid: string,
      possesion: string,
      agreement: string,
      resolution: string,
      practice: string
    }
  } = {
    id: '',
    names: '',
    lastNames: '',
    img: '',
    type: 0,
    email: '',
    dataStudent: {
      idNumber: '',
      career: '',
      isFree: 0,
      teacherAssignment: 0,
      cellphone: '',
      phone: '',
      address: '',
      schedule: '',
      hv: '',
      cardid: '',
      eps: '',
      enrollment: '',
      practice: '',
      convenioPractica: '',
      actaPractica: '',
      cumplimientoPractica: '',
      evaluacionPractica: '',
      informeFinalPractica: '',
      avanceMensual: [],
      seguimientoAsesoria: []
    },
    dataCompany: {
      name: '',
      razon: '',
      nit: '',
      address: '',
      phone: '',
      commerce: '',
      rut: '',
      cardid: '',
      possesion: '',
      agreement: '',
      resolution: '',
      practice: ''
    }
  };

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private url: LocationStrategy,
    public formBuilder: FormBuilder,
    public service: HttpService,
    public http: HttpClient
  ) {
    this.LogInLogin();
  }

  private LogInLogin() {
    if (this.url.path() === '/' && localStorage.getItem('us_token') != null) {
      this.userInfo = JSON.parse(localStorage.getItem('user'));
      this.router.navigate(['/inicio']);
    }
  }
}

export { DialogsComponent } from './dialogs/dialogs.component';
