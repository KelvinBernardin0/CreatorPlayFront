import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  constructor(private router: Router, private http: HttpClient) {}

  emailHTML: string = '';

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
        const combinedHTML = `
          <div id="header-container">${headerHTML}</div>
          <div id="content-container">${contentHTML}</div>
          <div id="footer-container">${footerHTML}</div>
        `;
        this.emailHTML = combinedHTML;
        this.router.navigate(['/email'], {
          queryParams: { emailHTML: this.emailHTML },
        });
      })
      .catch((error) =>
        console.error('Erro ao carregar o conteúdo do e-mail:', error)
      );
  }
}
