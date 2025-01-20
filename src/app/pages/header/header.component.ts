import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  Inicio(): void {
    this.router.navigate(['/inicio']); // Redirecionar para a página de inicio
  }
  Perfil(): void {
    this.router.navigate(['/perfil']); // Redirecionar para a página de perfil
  }

  Historico(): void {
    this.router.navigate(['/historico']); // Redirecionar para a página de perfil
  }
  Equipes(): void {
    this.router.navigate(['/equipes']); // Redirecionar para a página de equipe
  }
  Sair(): void {
    localStorage.clear(); // Limpar o localStorage após deslogar com sucesso
    this.router.navigate(['/login']); // Redirecionar para a página de login
  }
}
