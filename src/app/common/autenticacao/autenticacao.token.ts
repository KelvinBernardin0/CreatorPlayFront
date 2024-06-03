import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AutenticacaoToken {
  readonly minutesToken = GlobalConstants.minutesToken;
  constructor(private router: Router) {}

  Token() {
    const DataHoraAtual = new Date();
    const JwtTokenExpires = new Date(
      localStorage.getItem('JwtTokenExpires') || new Date()
    );
    const JwtTokenInativo = new Date(
      localStorage.getItem('JwtTokenInativo') || new Date()
    );

    if (
      localStorage.getItem('JwtToken') != null &&
      DataHoraAtual < JwtTokenExpires &&
      DataHoraAtual < JwtTokenInativo
    ) {
      //RENOVA O TEMPO DE 15 MIN DENTRO DO TOKEN !
      DataHoraAtual.setMinutes(DataHoraAtual.getMinutes() + this.minutesToken);
      localStorage.setItem('JwtTokenInativo', DataHoraAtual.toString());
      return true;
    }
    localStorage.removeItem('JwtToken');
    return false;
  }

  getRefreshToken(): string {
    return localStorage.getItem('x-refresh-token') || '';
  }
  Create(Token: string) {
    localStorage.removeItem('userToken');
    localStorage.setItem('userToken', Token);
  }
  Remove() {
    localStorage.removeItem('userToken');
  }

  Get(): string {
    var aux = localStorage.getItem('userToken') || '';
    return 'Bearer ' + aux; // Adicione 'Bearer ' antes do token
  }

  decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
