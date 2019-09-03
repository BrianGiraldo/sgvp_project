import { Component, OnInit } from '@angular/core';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { Md5 } from 'ts-md5/dist/md5';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AppComponent implements OnInit {
  typeuser = [
    {value: '1', viewValue: 'Estudiante'},
    {value: '2', viewValue: 'Empresa'},
    {value: '3', viewValue: 'Administrador'},
    {value: '4', viewValue: 'Docente'}
  ];
  typeuserDefault: any = '2';
  username: string;
  password: string;
  loginMethodState: boolean;

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.loginMethodState = false;
  }

  public login(email: string, password: string) {


    if (this.loginMethodState === true) {
      return false;
    }

    this.loginMethodState = true;
    const md5 = new Md5();
    const data = {
      function: 'LoginUser',
      email,
      password: md5.appendStr(password).end(),
      type_u: this.typeuserDefault
    };
    if (email === '') {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'La dirección de correo electrónico esta vacia.'}
      });
      this.loginMethodState = false;
      return false;
    }
    if (password === '') {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña esta vacia.'}
      });
      this.loginMethodState = false;
      return false;
    }

    this.service.get(data).subscribe(response => {
      this.loginMethodState = false;
      console.log('pase2');
      console.log(response);
      if (response.data === 'unauthorized') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Correo electrónico o contraseña no validos.'}
        });
      } else if (response.data === 'account_disabled') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'La cuenta esta deshabilitada.'}
        });
      } else if (response.data === 'error-token') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se ha podido iniciar, inténtalo mas tarde'}
        });
      } else {
        localStorage.setItem('us_token', response.data.ustk_token);
        this.userInfo.id = response.additional_data.us_id ? response.additional_data.us_id : '';
        this.userInfo.names = response.additional_data.us_names ? response.additional_data.us_names : '';
        this.userInfo.lastNames = response.additional_data.us_lastnames ? response.additional_data.us_lastnames : '';
        this.userInfo.img = response.additional_data.us_img ? response.additional_data.us_img : '';
        this.userInfo.type = response.additional_data.us_type ? response.additional_data.us_type : 0;
        this.userInfo.email = response.additional_data.us_email ? response.additional_data.us_email : '';
        if (this.userInfo.type === 1) {
          this.userInfo.dataStudent.idNumber = response.additional_data.st_idnumber ? response.additional_data.st_idnumber : '';
          this.userInfo.dataStudent.career = response.additional_data.st_career ? response.additional_data.st_career : '';
          this.userInfo.dataStudent.isFree = response.additional_data.st_isfree ? response.additional_data.st_isfree : 0;
          this.userInfo.dataStudent.teacherAssignment
            = response.additional_data.st_teacherassc ? response.additional_data.st_teacherassc : 0;
          this.userInfo.dataStudent.cellphone = response.additional_data.st_celphone ? response.additional_data.st_celphone : '';
          this.userInfo.dataStudent.phone = response.additional_data.st_phone ? response.additional_data.st_phone : '';
          this.userInfo.dataStudent.address = response.additional_data.st_address ? response.additional_data.st_address : '';
          this.userInfo.dataStudent.hv = response.additional_data.st_hv ? response.additional_data.st_hv : '';
          this.userInfo.dataStudent.cardid = response.additional_data.st_cardid ? response.additional_data.st_cardid : '';
          this.userInfo.dataStudent.eps = response.additional_data.st_eps ? response.additional_data.st_eps : '';
          this.userInfo.dataStudent.schedule = response.additional_data.st_schedule ? response.additional_data.st_schedule : '';
          this.userInfo.dataStudent.enrollment = response.additional_data.st_enrollment ? response.additional_data.st_enrollment : '';
          this.userInfo.dataStudent.practice = response.additional_data.st_practice ? response.additional_data.st_practice : '';
          this.userInfo.dataStudent.convenioPractica = response.additional_data.st_agreement_practice ? response.additional_data.st_agreement_practice : '';
          this.userInfo.dataStudent.actaPractica = response.additional_data.st_acta_practice ? response.additional_data.st_acta_practice : '';
          this.userInfo.dataStudent.informeFinalPractica = response.additional_data.st_informefinal_practice ? response.additional_data.st_informefinal_practice : '';
          this.userInfo.dataStudent.avanceMensual = response.additional_data.avance_mensual ? response.additional_data.avance_mensual : [];
          this.userInfo.dataStudent.seguimientoAsesoria = response.additional_data.seguimiento_asesoria ? response.additional_data.seguimiento_asesoria : [];
        }
        if (this.userInfo.type === 2) {
          this.userInfo.dataCompany.name = response.additional_data.comin_name ? response.additional_data.comin_name : '';
          this.userInfo.dataCompany.razon = response.additional_data.comin_razon ? response.additional_data.comin_razon : '';
          this.userInfo.dataCompany.nit = response.additional_data.comin_nit ? response.additional_data.comin_nit : 0;
          this.userInfo.dataCompany.address = response.additional_data.comin_address ? response.additional_data.comin_address : 0;
          this.userInfo.dataCompany.phone = response.additional_data.comin_phone ? response.additional_data.comin_phone : '';
          this.userInfo.dataCompany.commerce = response.additional_data.comin_commerce ? response.additional_data.comin_commerce : '';
          this.userInfo.dataCompany.rut = response.additional_data.comin_rut ? response.additional_data.comin_rut : '';
          this.userInfo.dataCompany.cardid = response.additional_data.comin_cardid ? response.additional_data.comin_cardid : '';
          this.userInfo.dataCompany.possesion = response.additional_data.comin_possesion ? response.additional_data.comin_possesion : '';
          this.userInfo.dataCompany.agreement = response.additional_data.comin_agreement ? response.additional_data.comin_agreement : '';
          this.userInfo.dataCompany.resolution = response.additional_data.comin_resolution ? response.additional_data.comin_resolution : '';
        }
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        console.log(localStorage.getItem('user'));
        this.router.navigate(['/inicio']);
        this.snackBar.open('Bienvenid@ a SGVP ' + response.additional_data.us_names, 'Cerrar', {
          duration: 4000
        });
      }
      this.loginMethodState = false;
    }, error => {
      this.loginMethodState = false;
      console.log(error);
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'Correo electrónico o contraseña no validos.'}
      });
    });

  }

  public openForgot(): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'forgot', title: 'Restablecer Contraseña', msg: 'Ingresa el correo electrónico con el que inicias sesión'}
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        const data = {
          function: 'Forgot',
          emailforgot: result
        };
        this.service.get(data).subscribe(res => {
          console.log(res);
          const response: any = {};
          if (response.data === 'no-exist') {
            this.dialog.open(DialogsComponent, {
              width: '350px',
              height: 'auto',
              data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo ingresado no pertenece a ninguna cuenta.'}
            });
          } else if (response.data === 'reset-password') {
            this.dialog.open(DialogsComponent, {
              width: '350px',
              height: 'auto',
              data: { typeDialog: 'alert',
                title: 'Restablecer Contraseña',
                msg: 'La contraseña se ha restablecido, revisa tu correo por favor.'
              }
            });
          }
        });
      }
    });

  }

  public newCompany(): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'new-company',
        title: 'Crear cuenta empresa',
        msg: 'Ingresa un correo electrónico y una contraseña para crear tu cuenta '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.emailnew !== '' && result.passnew !== '') {
          const data = {
            function: 'NewCompany',
            emailnew: result.emailnew,
            passnew: result.passnew
          };
          this.service.get(data).subscribe(res => {
            console.log(res);
            const response: any = {};
            if (response.data === 'exist') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert',
                  title: 'Espera...',
                  msg: 'La cuenta ya esta en uso.'
                }
              });
            } else {
              localStorage.setItem('us_token', response.data.us_token);
              localStorage.setItem('us_email', response.additional_data.us_email);
              localStorage.setItem('us_id', response.additional_data.us_id);
              localStorage.setItem('us_type', response.additional_data.us_type);
              localStorage.setItem('us_img', response.additional_data.us_img);
              this.router.navigate(['/inicio']);
              this.snackBar.open('Bienvenid@ a SGVP', 'Cerrar', {
                duration: 4000
              });
            }
          });
        }
      }
    });
  }
}
