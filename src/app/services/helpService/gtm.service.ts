import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GtmService {
  private readonly baseUrl = environment['apiURL'];

  constructor(private httpClient: HttpClient) {}

  carregarGtm() {
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WLDCM48');`;

    document.head.appendChild(gtmScript);
  }

  enviarEvento(
    event: string,
    category: string,
    action: string,
    label: string,
    value: string
  ) {
    window.dataLayer.push({
      event: event,
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    });

    // Envia o log para o back-end
    // Envia o log para o back-end

    this.LogsDoGTM({ event, category, action, label, value }).subscribe({
      next: (response) => {
        console.log('Log registrado com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao registrar log:', error);
      },
    });
  }

  LogsDoGTM(logData: {
    event: string;
    category: string;
    action: string;
    label: string;
    value: string;
  }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/v1/gtm/logsdogtm',
      logData
    );
  }
}
