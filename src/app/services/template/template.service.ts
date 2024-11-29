import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly baseUrl = environment['apiURL'];

  constructor(private httpClient: HttpClient) { }

  saveTemplate(template: object): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/templatehistory',
      template
    );
  }
}
