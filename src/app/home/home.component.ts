import { Component, OnInit } from '@angular/core';
import { AppComponent, DialogsComponent } from '../app.component';
import { FormGroup, Validators} from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent extends AppComponent implements OnInit {

  // ESTUDIANTE
  basicInfoFormGroup: FormGroup;
  documentsFormGroup: FormGroup;
  public usersDocente: any = [];
  teacherAssignment: number;
  career: string;
  programs: any = [];

  // COMPAÑIA
  basicInfoFormGroupCompany: FormGroup;
  documentsFormGroupCompany: FormGroup;
  razon: string = 'privada';

  public greeting: string;
  public firstName: string;
  public userType: number;
  public email: string;
  spinnerSendUserInfo: boolean;
  doneSendUserInfo: boolean;
  isLinear = false;
  srcResult;

  // DOCENTES
  public getUserMethodState: boolean;
  public getUsersParam: any;
  public currentUview: any;
  public getUsersOffset: number;
  public users: any = [];
  totalUsers = 0;

  ngOnInit( ) {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(this.userInfo);
    this.getUsersParam = {
      us_id: '',
      text: '',
      rol: '',
      docente: this.userInfo.id
    };
    this.firstName = this.userInfo.names;
    this.userType = this.userInfo.type;
    this.email = this.userInfo.email;
    this.teacherAssignment = this.userInfo.dataStudent.teacherAssignment;
    this.career = this.userInfo.dataStudent.career;
    this.razon = this.userInfo.dataCompany.razon;

    this.basicInfoFormGroup = this.formBuilder.group({
      us_email: [this.userInfo.email, Validators.required],
      us_names: [this.userInfo.names, Validators.required],
      us_lastNames: [this.userInfo.lastNames, Validators.required],
      st_idNumber: [this.userInfo.dataStudent.idNumber, Validators.required],
      st_cellphone: [this.userInfo.dataStudent.cellphone, Validators.required],
      st_phone: [this.userInfo.dataStudent.phone, Validators.required],
      st_address: [this.userInfo.dataStudent.address, Validators.required],
      st_schedule: [this.userInfo.dataStudent.schedule, Validators.required],
      st_isfree: [this.userInfo.dataStudent.isFree],
      st_teacher: [this.userInfo.dataStudent.teacherAssignment],
      st_career: [this.userInfo.dataStudent.career]
    });

    this.documentsFormGroup = this.formBuilder.group({
    });

    this.basicInfoFormGroupCompany = this.formBuilder.group({
      us_email: [this.userInfo.email, Validators.required],
      us_names: [this.userInfo.names, Validators.required],
      us_lastNames: [this.userInfo.lastNames, Validators.required],
      comin_name: [this.userInfo.dataCompany.name, Validators.required],
      comin_razon: [this.userInfo.dataCompany.razon],
      comin_nit: [this.userInfo.dataCompany.nit, Validators.required],
      comin_address: [this.userInfo.dataCompany.address, Validators.required],
      comin_phone: [this.userInfo.dataCompany.phone, Validators.required]
    });

    this.documentsFormGroupCompany = this.formBuilder.group({
    });

    this.time();
    setInterval(() => {
      this.time();
    }, 60000);

    if (this.userInfo.type == 4) {
      this.getUsers(10, 0);
    }
    if (this.userInfo.type == 1) {
      this.getUsersDocente();
      this.getPrograms();
    }
  }

  public time() {
    const now = new Date();
    const hour = now.getHours();
    if (hour <= 11) {
      this.greeting = 'Buenos Días';
    } else if (hour >= 12 && hour <= 18) {
      this.greeting = 'Buenas Tardes';
    } else if (hour > 18) {
      this.greeting = 'Buenas Noches';
    }
  }

  public changePassWord() {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'change-password',
        title: 'Cambiar contraseña',
        msg: 'Por favor ingresa tu contraseña antigua para verificar tu identidad.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.passold !== '' && result.passnew !== '') {
          const data = {
            function: 'ChangePassWord',
            passnew: Md5.hashStr(result.passnew),
            passold: Md5.hashStr(result.passold),
            us_id: this.userInfo.id,
            token: localStorage.getItem('us_token'),
            us_type: this.userInfo.type
          };
          this.service.update(data).subscribe(response => {
            if (response.data === 'oldpass-incorrect') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña antigua es incorrecta'}
              });
            } else if (response.data === 'change-ok') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Completado', msg: 'La contraseña se ha actualizado'}
              });
            } else {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña no se ha actualizado'}
              });
            }
          });
        }
      }
    });
  }

  public changePhoto(): void {
    document.getElementById('input-home-photo').click();
  }

  public fileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('fileSelected');
    console.log(input);
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      let base64Image = '';
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        base64Image = reader.result.toString();
        console.log(base64Image);
        this.savePhoto(base64Image);
      };
    }
  }

  public savePhoto(base64Image) {
    console.log('savePhoto');
    console.log(base64Image);
    const data = {
      function: 'ChangePhoto',
      base64Image,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    console.log(data);
    this.service.update(data).subscribe(response => {
      console.log('subscribe');
      console.log(response);
      if (response.data === 'change-ok') {
        document.getElementById('img-profile-1').setAttribute('src', base64Image);
        this.userInfo.img = base64Image;
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'Foto de perfil actualizada'}
        });
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se pudo cambiar la foto.'}
        });
      }
    });
  }

  public sendUserInfo() {
    console.log('UpdateUser');
    this.spinnerSendUserInfo = true;
    let data;
    if (this.userInfo.type == 1) {
      this.userInfo.email = this.basicInfoFormGroup.getRawValue().us_email;
      this.userInfo.dataStudent.idNumber = this.basicInfoFormGroup.getRawValue().st_idNumber;
      this.userInfo.names = this.basicInfoFormGroup.getRawValue().us_names;
      this.userInfo.lastNames = this.basicInfoFormGroup.getRawValue().us_lastNames;
      this.userInfo.dataStudent.cellphone = this.basicInfoFormGroup.getRawValue().st_cellphone;
      this.userInfo.dataStudent.phone = this.basicInfoFormGroup.getRawValue().st_phone;
      this.userInfo.dataStudent.address = this.basicInfoFormGroup.getRawValue().st_address;
      this.userInfo.dataStudent.schedule = this.basicInfoFormGroup.getRawValue().st_schedule;
      this.userInfo.dataStudent.teacherAssignment = this.teacherAssignment;
      this.userInfo.dataStudent.career = this.career;
      data = {
        function: 'UpdateUser',
        us_id: this.userInfo.id,
        token: localStorage.getItem('us_token'),
        us_type: this.userInfo.type,
        us_email: this.userInfo.email,
        us_names: this.userInfo.names,
        us_lastnames: this.userInfo.lastNames,
        st_idnumber: this.userInfo.dataStudent.idNumber,
        st_career: this.userInfo.dataStudent.career,
        st_isfree: this.userInfo.dataStudent.isFree,
        st_teacherassc: this.userInfo.dataStudent.teacherAssignment,
        st_celphone: this.userInfo.dataStudent.cellphone,
        st_phone: this.userInfo.dataStudent.phone,
        st_address: this.userInfo.dataStudent.address,
        st_schedule: this.userInfo.dataStudent.schedule
      };
    }

    if (this.userInfo.type == 2) {
      this.userInfo.email = this.basicInfoFormGroupCompany.getRawValue().us_email;
      this.userInfo.names = this.basicInfoFormGroupCompany.getRawValue().us_names;
      this.userInfo.lastNames = this.basicInfoFormGroupCompany.getRawValue().us_lastNames;
      this.userInfo.dataCompany.name = this.basicInfoFormGroupCompany.getRawValue().comin_name;
      this.userInfo.dataCompany.razon = this.basicInfoFormGroupCompany.getRawValue().comin_razon;
      this.userInfo.dataCompany.nit = this.basicInfoFormGroupCompany.getRawValue().comin_nit;
      this.userInfo.dataCompany.address = this.basicInfoFormGroupCompany.getRawValue().comin_address;
      this.userInfo.dataCompany.phone = this.basicInfoFormGroupCompany.getRawValue().comin_phone;
      data = {
        function: 'UpdateUser',
        us_id: this.userInfo.id,
        token: localStorage.getItem('us_token'),
        us_type: this.userInfo.type,
        us_email: this.userInfo.email,
        us_names: this.userInfo.names,
        us_lastnames: this.userInfo.lastNames,
        comin_name: this.userInfo.dataCompany.name,
        comin_razon: this.userInfo.dataCompany.razon,
        comin_nit: this.userInfo.dataCompany.nit,
        comin_address: this.userInfo.dataCompany.address,
        comin_phone: this.userInfo.dataCompany.phone
      };
    }

    console.log(data);
    console.log(this.userInfo);
    this.service.update(data).subscribe(response => {
      console.log('subscribe');
      console.log(response);
      if (response.data === 'ok') {
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        this.spinnerSendUserInfo = false;
        this.doneSendUserInfo = true;
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'Información actualizada'}
        });
      } else {
        this.spinnerSendUserInfo = false;
        this.doneSendUserInfo = false;
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se pudo actualizar la información.'}
        });
      }
    });
  }

  public changeRazon(razon) {
    console.log(razon);
    this.razon = razon;
    this.userInfo.dataCompany.razon = razon;
    console.log(this.userInfo.dataCompany.razon);
  }

  public changeCareer(career) {
    console.log(career);
    console.log(this.userInfo.dataStudent.career);
  }

  public changeFree(free) {
    console.log(free);
    console.log(this.userInfo.dataStudent.isFree);
  }

  public changeTeacher(teacher) {
    console.log(teacher);
    console.log(this.teacherAssignment);
  }

  public onFileSelected(nameFile: string, nameToSave: string, studentId?: number) {
    const inputNode: any = document.querySelector('#' + nameFile);
    document.querySelector('#' + nameFile + '_p').textContent = inputNode.files[0].name;
    console.log(inputNode.files);
    const fileList: FileList = inputNode.files;
    if (fileList.length > 0) {
      const fileToUpload = fileList.item(0);
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      console.log(formData.getAll('file'));
      this.service.sendData(this.userInfo, formData, nameToSave, studentId).subscribe(response => {
        console.log('subscribe');
        console.log(response);
        if (response.data === 'ok') {
          if (nameToSave === 'hv.pdf') {
            this.userInfo.dataStudent.hv = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'cardid.pdf') {
            if (this.userInfo.type == 1) {
              this.userInfo.dataStudent.cardid = response.url;
            } else if (this.userInfo.type == 2) {
              this.userInfo.dataCompany.cardid = response.url;
            }
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'eps.pdf') {
            this.userInfo.dataStudent.eps = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'enrollment.pdf') {
            this.userInfo.dataStudent.enrollment = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'practice.pdf') {
            this.userInfo.dataStudent.practice = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'commerce.pdf') {
            this.userInfo.dataCompany.commerce = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'rut.pdf') {
            this.userInfo.dataCompany.rut = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'possesion.pdf') {
            this.userInfo.dataCompany.possesion = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'conveniomarco.pdf') {
            this.userInfo.dataCompany.agreement = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'decretodep.pdf') {
            this.userInfo.dataCompany.resolution = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'conveniopractica.pdf') {
            this.userInfo.dataStudent.convenioPractica = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'actapractica.pdf') {
            this.userInfo.dataStudent.actaPractica = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'informefinalpractica.pdf') {
            this.userInfo.dataStudent.informeFinalPractica = response.url;
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'seguimiento.pdf') {
            location.reload();
          }
          if (nameToSave === 'avancemensual.pdf') {
            this.userInfo.dataStudent.avanceMensual.push(response.url);
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          if (nameToSave === 'seguimientoasesoria.pdf') {
            this.userInfo.dataStudent.seguimientoAsesoria.push(response.url);
            localStorage.setItem('user', JSON.stringify(this.userInfo));
          }
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Proceso', msg: 'Información actualizada'}
          });
        } else {
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: {
              typeDialog: 'alert',
              title: 'Espera...', msg: 'No fue posible actualizar el documento, por favor vuelva a intentarlo.'
            }
          });
        }
      });
    }
  }

  public getUsersDocente() {
    const data = {
      function: 'GetUsers',
      limit: 1000,
      offset: 0,
      param: '{"rol": "4"}',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      this.usersDocente = response.data;
    });
  }

  public getPrograms() {
    const data = {
      function: 'GetPrograms',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      this.programs = response.data;
    });
  }

  public getUsers(limit, offset) {
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
    this.getUsers(10, this.getUsersOffset);
  }

  public searchUser(ev) {
    this.getUsersOffset = 0;
    this.getUsers(10, this.getUsersOffset);
  }

  public viewUser(data) {

    this.currentUview = data;
    document.getElementById('view-u').style.width = '420px';
    document.getElementById('view-u').style.padding = '20px';
    console.log(data);

  }

  public closeviewUser() {
    document.getElementById('view-u').style.width = '0px';
    document.getElementById('view-u').style.padding = '0px';
  }

}
