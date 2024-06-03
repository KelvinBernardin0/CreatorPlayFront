import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) {
    //
    const token = localStorage.getItem('JwtToken');
    if (token) {
      const userId = this.getUserIdFromToken(token);
      const userName = this.getUserINameFromToken(token);
      if (userId) {
        this.userIdSubject.next(userId);
      } else {
        console.error('Nome do usuário não encontrado no token');
      }
      if (userName) {
        this.userNameSubject.next(userName);
      } else {
        console.error('ID do usuário não encontrado no token');
      }
    } else {
      console.error('Token JWT não encontrado no localStorage');
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData['jti'] || null;
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  }

  // private  getUserINameFromToken(token: string): string | null {

  //   try {
  //     const tokenData = JSON.parse(atob(token.split('.')[1]));
  //     return tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  //   } catch (error) {
  //     console.error('Erro ao decodificar o token JWT:', error);
  //     return null;
  //   }
  // }

  private getUserINameFromToken(token: string): string | null {
    //
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData['userName'] || null;
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  }

  get userId(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  get userName(): Observable<string | null> {
    return this.userNameSubject.asObservable();
  }

  getStoredUserId(): string | null {
    return localStorage.getItem('UserId');
  }

  setUserId(userId: string): void {
    // Armazenar o ID do usuário no localStorage
    localStorage.setItem('userId', userId);
    this.userIdSubject.next(userId);
  }

  setUserName(userName: string): void {
    // Armazenar o nome do usuário no localStorage
    localStorage.setItem('userName', userName);
    this.userNameSubject.next(userName);
  }

  clearUserId(): void {
    // Remover o ID do usuário do localStorage

    localStorage.removeItem('userId');
    this.userIdSubject.next(null);
  }

  clearUserName(): void {
    // Remover o nome do usuário do localStorage
    localStorage.removeItem('userName');
    this.userNameSubject.next(null);
  }
}
