import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AppComponent implements OnInit {
  HCemail: string;
  userType: number;

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.HCemail = this.userInfo.email;
    this.userType = this.userInfo.type;
  }

  public logout() {
    const data = {
      function: 'Logout',
      us_token: localStorage.getItem('us_token'),
      us_id: this.userInfo.id,
    };
    this.service.update(data).subscribe(response => {
      console.log(response);
    });
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
