import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AutenticacaoGuard } from './common/autenticacao/autenticacao.guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component';
import { RegistraseComponent } from './pages/login/registrase/registrase.component';
import { EsqueciSenhaComponent } from './pages/login/esqueci-senha/esqueci-senha.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SenhaComponent } from './pages/senha/senha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AutenticacaoInterceptor } from './common/autenticacao/autenticacao.interceptor';
import { HeaderComponent } from './pages/header/header.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'header',
    component: HeaderComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registra-se',
    component: RegistraseComponent,
  },
  {
    path: 'esqueci-senha',
    component: EsqueciSenhaComponent,
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
    path: 'senha',
    component: SenhaComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistraseComponent,
    EsqueciSenhaComponent,
    InicioComponent,
    HeaderComponent,
    PerfilComponent,
    SenhaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],

  providers: [
    AutenticacaoGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AutenticacaoInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
