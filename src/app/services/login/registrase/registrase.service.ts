import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  RegistraseModel,
  RegistraseRhModel,
  ValidarCnpjModel,
} from 'src/app/models/login/registrase/registrase-model';

@Injectable({
  providedIn: 'root',
})
export class RegistraseService {
  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  registrarUsuario(usuario: RegistraseModel): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/users/criarusuario',
      usuario
    );
  }

  registrarGestorRH(usuario: RegistraseRhModel): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/gestaorh/gestor/',
      usuario
    );
  }

  registrarColaboradorRH(usuario: RegistraseRhModel): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/gestaorh/colaborador/',
      usuario
    );
  }

  buscarParceiroPorTermo(termoDeBusca: string): Observable<any[]> {
    return this.httpClient.get<any[]>(
      this.baseUrl + '/api/v1/gestaorh/parceiro?termoDeBusca=' + termoDeBusca
    );
  }

  validarCnpj(cnpj: ValidarCnpjModel): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/api/v1/gestaorh/parceiro-por-cnpj?cnpj=${cnpj}`
    );
  }

  // validarCnpj(cnpj: ValidarCnpjModel): Observable<any> {
  //   return this.httpClient.get<any>(
  //     `${this.baseUrl}/VVEAPI/verificar-cnpj?Cnpj=${cnpj}`
  //   );
  // }

  validarCnpjGetNet(cnpj: ValidarCnpjModel): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/api/v1/vveapi/verifica-cnpj?cnpj=${cnpj}`
    );
  }

  validarChave(chaveDeCadastro: string, cnpj: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/api/v1/gestaorh/chave-cadastro?chaveDeCadastro=${chaveDeCadastro}&cnpj=${cnpj}`
    );
  }
}
