import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class LogGeralService {
  readonly apiURL = GlobalConstants.apiURL;
  readonly headersGet = GlobalConstants.headersGet;
  constructor(private http: HttpClient) { }

  PutUsuarioNavegacao(formData: FormData) {
    return this.http.post(this.apiURL + '/ApiSeguranca/LogGeral/PutUsuarioNavegacao', formData);
  }
  PutLogErro(formData: FormData) {
    return this.http.post(this.apiURL + '/ApiSeguranca/LogGeral/PutLogErro', formData);
  }

}
