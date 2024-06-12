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
    this.carregarEmail('assets/componentes/headers/headers_sem_imagem.html'); // Corrigido o caminho do arquivo
  }

  redirecionarParaEmailComImagem() {
    this.carregarEmail('assets/componentes/headers/headers_imagem_pequena.html'); // Corrigido o caminho do arquivo
  }

  carregarEmail(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      this.emailHTML = data;
      this.router.navigate(['/email'], { queryParams: { emailHTML: this.emailHTML } });
    });
  }

  
}
