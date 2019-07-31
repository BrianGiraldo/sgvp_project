import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent {
  public nc;
  public cp;
  public no;

  constructor(public dialogRef: MatDialogRef<DialogsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.nc = {
      emailnew: '',
      passnew: ''
    };
    this.cp = {
      passold: '',
      passnew: ''
    };
    this.no = {
      name: '',
      description: '',
      img: ''
    };
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
        this.no.img = base64Image;
      };
    }
  }

}
