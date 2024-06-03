import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilModel } from 'src/app/models/meuPerfil/perfil/perfil-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly baseUrl = environment['apiURL'];

  constructor(private httpClient: HttpClient) { }

  obterPerfilUsuarioGestor(headers: HttpHeaders): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/usuario/perfil/gestor`, {
      headers,
    });
  }

  obterPerfilUsuarioColaborador(headers: HttpHeaders): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/usuario/perfil/colaborador`, {
      headers,
    });
  }

  atualizarPerfilGestor(perfil: PerfilModel): Observable<any> {
    return this.httpClient.put<any>(
      `${this.baseUrl}/api/v1/usuario/perfil/gestor`,
      perfil
    );
  }

  obterPerfilUsuario(headers: HttpHeaders): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/usuario/perfil`, { headers });
  }

  atualizarPerfil(perfil: PerfilModel): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/api/v1/usuario/perfil`, perfil);
  }
}
