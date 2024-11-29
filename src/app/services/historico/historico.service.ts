import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getTemplate(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + '/api/v1/templatehistory',
    );
  }

}
