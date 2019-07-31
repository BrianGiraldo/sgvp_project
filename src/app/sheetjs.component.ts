import { Component } from '@angular/core';

import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sheetjs',
  template: `
	<input type="file" (change)="onFileChange($event)" multiple="false" />
	<table class="sjs-table">
		<tr *ngFor="let row of data">
			<td *ngFor="let val of row">
				{{val}}
			</td>
		</tr>
	</table>
	<button *ngIf="dataUsers" (click)="saveUsers(this.dataUsers)">Guardar usuarios</button>
	`
})

export class SheetJSComponent {
  data: AOA;
  dataUsers: any;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
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
      this.data = <AOA>(data);
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
    if (colums[4] !== 'contraseña') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 5 fila 1 debe contener la contraseña' };
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
        if (data[x][4] && data[x][4] !== '') {
          user.password = data[x][4];
        } else {
          response = { state: 'error', message: 'El formato del excel no coincide, la columna 1 fila ' + x +
              ' debe contener una contraseña valida para el usuario' };
          break;
        }
        response.data.push(user);
      }
    }
    return response;
  }

  saveUsers(data) {
    console.log('saveUsers');
    console.log(data);
  }
}
