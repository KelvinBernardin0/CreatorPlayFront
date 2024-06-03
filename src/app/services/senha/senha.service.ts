import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SenhaModel } from 'src/app/models/meuPerfil/senha/senha-model';

@Injectable({
  providedIn: 'root',
})
export class SenhaService {
  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  trocarSenha(senhaModel: SenhaModel): Observable<any> {
    var id = localStorage.getItem('IDUsuario');
    return this.httpClient.put<any>(
      `${this.baseUrl}/api/v1/usuario/senha`,
      senhaModel
    );
  }

  trocarSenhaGestor(senhaModel: SenhaModel): Observable<any> {
    var id = localStorage.getItem('IDUsuario');
    return this.httpClient.put<any>(
      `${this.baseUrl}/api/v1/usuario/senha/gestor`,
      senhaModel
    );
  }

  // trocarSenha(senhaModel: SenhaModel): Observable<any> {
  //
  //   // var id = localStorage.getItem('IDUsuario');
  //   return this.httpClient.put<any>(`${this.baseUrl}/Usuario/senha/` + id, senhaModel);
  // }
}
