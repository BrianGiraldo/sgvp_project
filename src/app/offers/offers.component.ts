import { Component, OnInit } from '@angular/core';
import {AppComponent, DialogsComponent} from '../app.component';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent extends AppComponent implements OnInit {

  offers = [];
  currentUview;
  currentCview;
  acceptedAplications = [];

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(this.userInfo);
    const data = {
      function: 'GetOffers',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      console.log(response);
      this.offers = response.data;
      this.getAcceptedAplications();
    });
  }

  public getAcceptedAplications() {
    console.log(this.offers);
    for (const indexOffer in this.offers) {
      const offer = this.offers[indexOffer];
      console.log(offer);
      for (const indexApplication in offer.applications) {
        const application = offer.applications[indexApplication];
        if (application.state == 1) {
          this.acceptedAplications.push({offer, application});
        }
      }
    }
  }

  public crearOferta() {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'new-offer',
        title: 'Crear oferta',
        msg: 'Por favor ingresa los datos de la oferta'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.name !== '' && result.description !== '' && result.img !== '') {
          const data = {
            function: 'NewOffer',
            name: result.name,
            description: result.description,
            img: result.img,
            us_id: this.userInfo.id,
            token: localStorage.getItem('us_token'),
            us_type: this.userInfo.type
          };
          this.service.set(data).subscribe(response => {
            if (response.data === 'ok') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Completado', msg: 'La oferta se ha creado'}
              });
              location.reload();
            } else {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La oferta no se a creado'}
              });
            }
          });
        } else {
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'Información incorrecta'}
          });
        }
      }
    });
  }

  public eliminarOferta(offer) {
    const data = {
      function: 'DeleteOffer',
      offer_id: offer.offer_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.set(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La oferta se ha eliminado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al eliminar la oferta'}
        });
      }
    });
  }

  public aplicarOferta(offer) {
    const data = {
      function: 'ApplyOffer',
      offer_id: offer.offer_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.set(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'Se ha aplicado a la oferta'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al aplicar a la oferta'}
        });
      }
    });
  }

  public noAplicarOferta(offer) {
    const data = {
      function: 'DeleteApplyOffer',
      offer_student_id: offer.offer_student_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.set(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La aplicación a la oferta se ha eliminado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al eliminar la aplicación a la oferta'}
        });
      }
    });
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

  public viewCompany(data) {
    this.currentCview = data;
    document.getElementById('view-c').style.width = '420px';
    document.getElementById('view-c').style.padding = '20px';
    console.log(data);
  }

  public closeviewCompany() {
    document.getElementById('view-c').style.width = '0px';
    document.getElementById('view-c').style.padding = '0px';
  }

  aceptarAplicante(user) {
    const data = {
      function: 'AcceptApplyOffer',
      offer_student_id: user.offer_student_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.update(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La aplicación se ha aceptado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al rechazar la aplicación'}
        });
      }
    });
  }

  rechazarAplicante(user) {
    const data = {
      function: 'DenyApplyOffer',
      offer_student_id: user.offer_student_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.update(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La aplicación se ha rechazado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al rechazar la aplicación'}
        });
      }
    });
  }

  aceptarNuevoPracticante(item) {
    console.log(item);
    const data = {
      function: 'AdminAcceptApplyOffer',
      offer_student_id: item.application.offer_student_id,
      student_id: item.application.student_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.update(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La aplicación se ha aceptado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al aceptar la aplicación'}
        });
      }
    });
  }

  rechazarNuevoPracticante(item) {
    console.log(item);
    const data = {
      function: 'DenyApplyOffer',
      offer_student_id: item.application.offer_student_id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.update(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La aplicación se ha rechazado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al rechazar la aplicación'}
        });
      }
    });
  }

}
