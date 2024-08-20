import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly baseUrl = environment['apiURL'];

  constructor(private httpClient: HttpClient) {}

  LoginUsuario(objeto: any) {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/authentication',
      objeto
    );
  }
}
