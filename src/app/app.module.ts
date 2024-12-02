import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule, DatePipe} from '@angular/common';
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
import {ContextMenuComponent} from './pages/email/components/menu/context-menu/context-menu.component';
import {HoverBorderComponent} from './pages/email/components/menu/hover-border/hover-border.component';
import {EmailComponent} from './pages/email/email.component';
import {HeaderComponent} from './pages/header/header.component';
import {InicioComponent} from './pages/inicio/inicio.component';
import {EsqueciSenhaComponent} from './pages/login/esqueci-senha/esqueci-senha.component';
import {LoginComponent} from './pages/login/login/login.component';
import {RegistraseComponent} from './pages/login/registrase/registrase.component';
import {PerfilComponent} from './pages/perfil/perfil.component';
import { BuildingBlocksMenuComponent } from './pages/email/components/menu/building-blocks-menu/building-blocks-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionInputComponent } from './pages/email/components/input/selection-input/selection-input.component';
import { FileInputComponent } from './pages/email/components/input/file-input/file-input.component';
import { TextInputComponent } from './pages/email/components/input/text-input/text-input.component';
import { ToggleInputComponent } from './pages/email/components/input/toggle-input/toggle-input.component';
import { TypographyMenuComponent } from './pages/email/components/menu/typography-menu/typography-menu.component';
import { ImageMenuComponent } from './pages/email/components/menu/image-menu/image-menu.component';
import ButtonMenuComponent from './pages/email/components/menu/button-menu/button-menu.component';
import { CardsMenuComponent } from './pages/email/components/menu/cards-menu/cards-menu.component';
import { PlansMenuComponent } from './pages/email/components/menu/plans-menu/plans-menu.component';
import { VitrineMenuComponent } from './pages/email/components/menu/vitrine-menu/vitrine-menu.component';
import { HistoricoComponent } from './pages/historico/historico.component';

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
  {
    path: 'historico',
    component: HistoricoComponent,
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
    ToggleInputComponent,
    TypographyMenuComponent,
    ImageMenuComponent,
    ButtonMenuComponent,
    CardsMenuComponent,
    PlansMenuComponent,
    VitrineMenuComponent,
    HistoricoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
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
