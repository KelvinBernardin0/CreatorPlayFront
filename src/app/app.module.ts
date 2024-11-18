import {DragDropModule} from '@angular/cdk/drag-drop';
import {DatePipe} from '@angular/common';
import {HTTP_INTERCEPTORS,HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule,Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AutenticacaoGuard} from './common/autenticacao/autenticacao.guard';
import {AutenticacaoInterceptor} from './common/autenticacao/autenticacao.interceptor';
import {CenteredContentComponent} from './pages/email/components/centered-content/centered-content.component'; // Import DragDropModule
import {ContextMenuComponent} from './pages/email/components/context-menu/context-menu.component';
import {HoverBorderComponent} from './pages/email/components/hover-border/hover-border.component';
import {EmailComponent} from './pages/email/email.component';
import {HeaderComponent} from './pages/header/header.component';
import {InicioComponent} from './pages/inicio/inicio.component';
import {EsqueciSenhaComponent} from './pages/login/esqueci-senha/esqueci-senha.component';
import {LoginComponent} from './pages/login/login/login.component';
import {RegistraseComponent} from './pages/login/registrase/registrase.component';
import {PerfilComponent} from './pages/perfil/perfil.component';
import { BuildingBlocksMenuComponent } from './pages/email/components/building-blocks-menu/building-blocks-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionInputComponent } from './pages/email/components/selection-input/selection-input.component';
import { FileInputComponent } from './pages/email/components/file-input/file-input.component';
import { TextInputComponent } from './pages/email/components/text-input/text-input.component';

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
    CenteredContentComponent,
    BuildingBlocksMenuComponent,
    SelectionInputComponent,
    FileInputComponent,
    TextInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    DragDropModule,
    NgbModule
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
