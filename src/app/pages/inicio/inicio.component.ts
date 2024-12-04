import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {StringState} from 'src/app/common/types/State';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  constructor(private router: Router, private http: HttpClient) {}

  emailHTML: string = '';

  redirecionarParaMaestro() {
    window.open(
      'https://app.powerbi.com/groups/me/reports/b691e0b8-3942-4386-a860-9f0b71f17523/ReportSection?ctid=9744600e-3e04-492e-baa1-25ec245c6f10&experience=power-bi',
      '_blank'
    );
  }

  // redirecionarParaEmailSemImagem() {
  //   this.carregarEmail(
  //     'assets/componentes/headers/headers_sem_imagem.html',
  //     'assets/componentes/conteudo.html',
  //     'assets/componentes/footers/footer_inverso.html'
  //   );
  // }

  redirecionarParaEmailComImagem() {
    this.carregarEmail(
      'assets/componentes/headers/headers_imagem_grande.html',
      'assets/componentes/conteudo.html',
      'assets/componentes/footers/footer.html'
    );
  }

  carregarEmail(headerUrl: string, contentUrl: string, footerUrl: string) {
    Promise.all([
      this.http.get(headerUrl, { responseType: 'text' }).toPromise(),
      this.http.get(contentUrl, { responseType: 'text' }).toPromise(),
      this.http.get(footerUrl, { responseType: 'text' }).toPromise(),
    ])
      .then((responses) => {
        const [headerHTML, contentHTML, footerHTML] = responses;

        const state: StringState = {
          header: headerHTML!,
          content: contentHTML!,
          footer: footerHTML!
        }
        this.router.navigate(['/email'], {
          state: state,
        });
      })
      .catch((error) =>
        console.error('Erro ao carregar o conteúdo do e-mail:', error)
      );
  }
}
