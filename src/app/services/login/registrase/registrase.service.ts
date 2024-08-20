import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  RegistraseModel,
} from 'src/app/models/login/registrase/registrase-model';

@Injectable({
  providedIn: 'root',
})
export class RegistraseService {
  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  registrarUsuario(usuario: RegistraseModel): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/users',
      usuario
    );
  }

  listarPerfisDeAcesso(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + '/api/v1/users/access-profile');
  }
}


