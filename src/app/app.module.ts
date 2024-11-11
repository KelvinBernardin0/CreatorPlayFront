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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AutenticacaoInterceptor } from './common/autenticacao/autenticacao.interceptor';
import { HeaderComponent } from './pages/header/header.component';
import { DatePipe } from '@angular/common';
import { EmailComponent } from './pages/email/email.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContextMenuComponent } from './pages/email/context-menu/context-menu.component';
import { HoverBorderComponent } from './pages/email/hover-border/hover-border.component'; // Import DragDropModule

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrase',
    component: RegistraseComponent,
  },
  {
    path: 'esqueci-senha',
    component: EsqueciSenhaComponent,
  },
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
    EmailComponent,
    ContextMenuComponent,
    HoverBorderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    DragDropModule
  ],

  providers: [
    AutenticacaoGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AutenticacaoInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
