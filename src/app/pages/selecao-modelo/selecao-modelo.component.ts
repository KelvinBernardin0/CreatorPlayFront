import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {StringState} from 'src/app/common/types/State';
@Component({
  selector: 'app-selecao-modelo',
  templateUrl: './selecao-modelo.component.html',
  styleUrls: ['./selecao-modelo.component.css']
})
export class SelecaoModeloComponent {
  constructor(private router: Router, private http: HttpClient) {}
  emailHTML: string = '';


  redirecionarParaTemplates() {
    this.router.navigate(['/templates']);
  }

  redirecionarParaEmailSemImagem() {
    this.carregarEmail(
      'assets/componentes/headers/headers_sem_imagem.html',
      'assets/componentes/conteudo.html',
      'assets/componentes/footers/footer_inverso.html'
    );
  }

  redirecionarParaEmailComImagem() {
    this.carregarEmail(
      'assets/componentes/headers/headers_imagem_pequena.html',
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
