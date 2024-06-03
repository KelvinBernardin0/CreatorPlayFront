import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  Perfil(): void {
    this.router.navigate(['/perfil']); // Redirecionar para a página de perfil
  }

  Senha(): void {
    this.router.navigate(['/senha']); // Redirecionar para a página de senha
  }

  Sair(): void {
    localStorage.clear(); // Limpar o localStorage após deslogar com sucesso
    this.router.navigate(['/login']); // Redirecionar para a página de login
  }
}
