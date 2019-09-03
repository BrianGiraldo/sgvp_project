import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpService } from '../services/http.service';
import { MatDialog } from '@angular/material';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { AppComponent } from '../app.component';

import * as XLSX from 'xlsx';

type AOA = any[][];


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends AppComponent implements OnInit {
  typeUser: any;
  typeUserDefault: any = '1';
  newU: any;
  newUserMethodState: boolean;
  getUserMethodState: boolean;
  users: any;
  programs: any[];
  totalUsers: number;
  getUsersParam: any = {
    us_id: '',
    text: '',
    rol: ''
  };
  getUsersOffset: number;
  listFilter = [
    {value: '0', viewValue: 'Todos'},
    {value: '1', viewValue: 'Estudiantes'},
    {value: '2', viewValue: 'Empresas'},
    {value: '3', viewValue: 'Admin'},
    {value: '4', viewValue: 'Docente'},
    {value: '5', viewValue: 'Est. con Contrato'},
    {value: '6', viewValue: 'Est. sin Contrato'}
  ];
  currentUview: any = null;
  currentCview: any = null;
  currentOtherUserview: any = null;

  data: AOA;
  dataUsers: any;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';


  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.typeUser = [
      {value: '1', viewValue: 'Estudiante'},
      {value: '2', viewValue: 'Empresa'},
      {value: '3', viewValue: 'Administrador'},
      {value: '4', viewValue: 'Docente'}
    ];
    this.newU = {
      email: '',
      pass: '',
      names: '',
      lastnames: '',
      us_type: '',
      st_career: ''
    };
    this.getUsersOffset = 0;
    this.newUserMethodState = false;
    this.getUserMethodState = false;
    this.users = [];
    this.programs = [];
    this.totalUsers = 0;
    this.getPrograms();
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
    this.currentUview = { us_img: null };
    this.currentCview = { us_img: null };
    this.currentOtherUserview = { us_img: null };
  }

  public createUser(typeUserDefault) {
    this.newU.us_type = typeUserDefault;
    if (this.newU.email !== '' && this.newU.pass !== '' && this.newU.names !== ''
      && this.newU.lastNames !== '' && this.newU.us_type !== '') {
      this.newU.pass = Md5.hashStr(this.newU.pass);
      const data = {
        function: 'NewUser',
        query: this.newU,
        us_id: this.userInfo.id,
        token: localStorage.getItem('us_token'),
        us_type: this.userInfo.type
      };
      this.newUserMethodState = true;
      this.service.set(data).subscribe(response => {
        setTimeout(() => {
          this.newUserMethodState = false;
        }, 500);
        if (response.data === 'user-exist') {
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo electrónico ya ha sido usado en otra cuenta.'}
          });
          return;
        } else if (response.data === 'user-create') {
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Completado', msg: 'Nuevo usuario registrado.'}
          });
        }
        this.newU = {
          email: '',
          pass: '',
          names: '',
          lastNames: ''
        };
        this.getUsers(10, this.getUsersOffset, this.getUsersParam);
      });
    }
  }

  public createUserExcel() {
    document.getElementById('input-users-excel').click();

  }

  public filesSelectcreateUserExcel(): void {
  }

  public getUsers(limit, offset, param) {
    this.getUserMethodState = true;
    const data = {
      function: 'GetUsers',
      limit,
      offset,
      param: JSON.stringify(this.getUsersParam),
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      this.getUserMethodState = false;
      if (this.getUsersOffset !== 0) {
        this.users = this.users.concat(response.data);
      } else {
        this.users = response.data;
        this.totalUsers = response.data_length;
      }
    });
  }

  public getUsersMore() {

    this.getUsersOffset = this.users.length;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);

  }

  public searchUser(ev) {
    this.getUsersOffset = 0;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
  }

  public searchUserRol(ev) {
    this.getUsersOffset = 0;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
  }


  public viewUser(data) {
    if (data.us_type === 1) {
      this.currentUview = data;
      document.getElementById('view-u').style.width = '420px';
      document.getElementById('view-u').style.padding = '20px';
    } else if (data.us_type === 2) {
      this.currentCview = data;
      document.getElementById('view-c').style.width = '420px';
      document.getElementById('view-c').style.padding = '20px';
    } else {
      this.currentOtherUserview = data;
      document.getElementById('view-other').style.width = '420px';
      document.getElementById('view-other').style.padding = '20px';
    }
    console.log(data);
  }

  public closeviewUser() {
    document.getElementById('view-u').style.width = '0px';
    document.getElementById('view-u').style.padding = '0px';
  }

  public closeviewCompany() {
    document.getElementById('view-c').style.width = '0px';
    document.getElementById('view-c').style.padding = '0px';
  }

  public closeviewOtherUser() {
    document.getElementById('view-other').style.width = '0px';
    document.getElementById('view-other').style.padding = '0px';
  }

  public getPrograms() {

    const data = {
      function: 'GetPrograms',
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('us_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.get(data).subscribe(response => {
      this.programs = response.data;
    });
  }

  onFileChange(evt: any) {
    const inputNode: any = document.querySelector('#fileExcel');
    document.querySelector('#fileExcel_p').textContent = inputNode.files[0].name;
    /* wire up file reader */
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      const validate = this.validateUsers('1', data);
      this.data = (data) as AOA;
      if (validate.state === 'ok') {
        this.dataUsers = validate.data;
      } else {
        console.log(validate);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  validateUsers(type: '1', data: any) {
    let response: any = { state: 'ok' };
    const colums = data[0];
    data.splice(0, 1);
    if (colums[0] !== 'nombres') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 1 fila 1 debe contener los nombres' };
    }
    if (colums[1] !== 'apellidos') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 2 fila 1 debe contener los apellidos' };
    }
    if (colums[2] !== 'carrera') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 3 fila 1 debe contener la carrera' };
    }
    if (colums[3] !== 'correo') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 4 fila 1 debe contener el correo' };
    }
    if (response.state === 'ok') {
      response.data = [];
      for (const x in data) {
        console.log(data[x]);
        const user: any = {};
        if (data[x][0] && data[x][0] !== '') {
          user.names = data[x][0];
        } else {
          response = { state: 'error', message: 'El formato del excel no coincide, la columna 1 fila ' + x +
              ' debe contener un nombre valido del usuario' };
          break;
        }
        if (data[x][1] && data[x][1] !== '') {
          user.lastnames = data[x][1];
        } else {
          response = { state: 'error', message: 'El formato del excel no coincide, la columna 2 fila ' + x +
              ' debe contener un apellido valido del usuario' };
          break;
        }
        if (data[x][2] && data[x][2] !== '') {
          user.career = data[x][2];
        } else {
          response = { state: 'error', message: 'El formato del excel no coincide, la columna 3 fila ' + x +
              ' debe contener una carrera valida del usuario' };
          break;
        }
        if (data[x][3] && data[x][3] !== '') {
          user.email = data[x][3];
        } else {
          response = { state: 'error', message: 'El formato del excel no coincide, la columna 4 fila ' + x +
              ' debe contener un correo valido del usuario' };
          break;
        }
        user.password = 'e10adc3949ba59abbe56e057f20f883e';
        response.data.push(user);
      }
    }
    return response;
  }

  saveUsers() {
    console.log('saveUsers');
    console.log(this.dataUsers);
    const data = {
      function: 'NewUsers',
      param: '{ "data": ' + JSON.stringify(this.dataUsers) + '}',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.set(data).subscribe(response => {
      console.log('ok');
      console.log(response);
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Los usuarios han sido creados', msg: response.data}
      });
    });
  }
}
