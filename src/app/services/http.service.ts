import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public ServerUrl: string;
  public headers: any;
  public options: any;

  constructor(private http: HttpClient) {
    this.ServerUrl = 'http://localhost/SGVP-BackEnd/handler.php'; // 'http://190.114.255.122/SGVP-BackEnd/handler.php';
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  public get(additionalData: any): Observable<any> {
    this.options = { headers: this.headers, params: additionalData };
    return this.http.get(`${this.ServerUrl}`, this.options);
  }

  public set(additionalData: any): Observable<any> {
    additionalData = JSON.stringify(additionalData);
    this.options = { headers: this.headers };
    return this.http.post(`${this.ServerUrl}`, additionalData, this.options);
  }

  public update(additionalData: any): Observable<any> {
    additionalData = JSON.stringify(additionalData);
    this.options = { headers: this.headers };
    return this.http.put(`${this.ServerUrl}`, additionalData, this.options);
  }

  public sendData(userInfo: any, formData: FormData, nameToSave: string, studentId?): Observable<any> {
    let httpOptions = new HttpHeaders({
        additional: JSON.stringify({
          function: 'SaveFile',
          us_id: userInfo.id,
          token: localStorage.getItem('us_token'),
          us_type: userInfo.type,
          file_name: nameToSave
        })
      });
    if (userInfo.type === 4) {
      httpOptions = new HttpHeaders({
        additional: JSON.stringify({
          function: 'SaveFile',
          us_id: userInfo.id,
          student_id: studentId,
          token: localStorage.getItem('us_token'),
          us_type: userInfo.type,
          file_name: nameToSave
        })
      });
    }
    return this.http.post(this.ServerUrl, formData, { headers: httpOptions });
  }
}
