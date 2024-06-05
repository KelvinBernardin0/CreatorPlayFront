import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly baseUrl = environment['apiURL'];

  constructor(private httpClient: HttpClient) {}

  LoginUsuarioRH(objeto: any) {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/autenticacao/gestor-rh',
      objeto
    );
  }

  LoginUsuario(objeto: any) {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/authentication/autenticar',
      objeto
    );
  }

  DescriptografarLoginSso(sso: string) {
    // Defina o objeto a ser enviado no corpo da requisição
    const requestBody = {
      token: sso,
    };

    // Realize a requisição POST enviando o objeto no corpo da requisição
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/autenticacao/token-decript',
      requestBody
    );
  }

  LoginSso(objeto: any) {
    return this.httpClient.post<any>(this.baseUrl + '/api/v1/home/', objeto);
  }

  VerificarUsuarioTemDadosAtualizados(): Observable<boolean> {
    // Faça a chamada à API GET /Onboarding/UsuarioTemDadosAtualizados
    return this.httpClient.get<boolean>(
      `${this.baseUrl}/api/v1/onboarding/usuario/dados-atualizados`
    );
  }
}
