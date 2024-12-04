import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login/login.component';
import { RegistraseComponent } from './pages/login/registrase/registrase.component';
import { EsqueciSenhaComponent } from './pages/login/esqueci-senha/esqueci-senha.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HeaderComponent } from './pages/header/header.component';
import { AutenticacaoGuard } from './common/autenticacao/autenticacao.guard';
import { EmailComponent } from './pages/email/email.component';
import { HistoricoComponent } from './pages/historico/historico.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrase', component: RegistraseComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },
  {
    path: 'header',
    component: HeaderComponent,
  },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  {
    path: 'email',
    component: EmailComponent,
  },
  {
    path: 'historico',
    component: HistoricoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AutenticacaoGuard],
})
export class AppRoutingModule {}
