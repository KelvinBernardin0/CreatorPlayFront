import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { GlobalConstants } from 'src/app/common/global-constants';
import { AutenticacaoToken } from 'src/app/common/autenticacao/autenticacao.token';
import { LoginModel } from 'src/app/models/login/login/login-model';
import { LoginService } from 'src/app/services/login/login/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  formData = new FormData();
  readonly minutesToken = GlobalConstants.minutesToken;
  showSpinner: boolean = false;

  constructor(
    private autenticacaoToken: AutenticacaoToken,
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService,
    private notificacaoService: NotificacaoService,
    private spinner: NgxSpinnerService
  ) {
    this.loginForm = this.formBuilder.group({
      token: ['', [Validators.required]],
      secret: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  submitLogin() {
    this.showSpinner = true; // Exibe o spinner (carregamento)
    var dadosLogin = this.loginForm.getRawValue() as LoginModel;
    this.loginService.LoginUsuario(dadosLogin).subscribe(
      (data: any) => {
        console.log(data);
        const decodedToken = this.autenticacaoToken.decodeToken(data.token);
        const userRole =
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        const DataHoraAtual = new Date();
        DataHoraAtual.setMinutes(
          DataHoraAtual.getMinutes() + this.minutesToken
        );
        localStorage.setItem('UserId', decodedToken.id);
        localStorage.setItem('Email', decodedToken.email);
        localStorage.setItem('JwtToken', data.token);
        localStorage.setItem('JwtTokenExpires', data.expiration);
        localStorage.setItem('JwtTokenInativo', DataHoraAtual.toString());
        localStorage.setItem('JwtTokenBearer', 'Bearer ' + data.token);
        localStorage.setItem('UserRole', userRole);
        this.router.navigate(['/inicio']);
        this.showSpinner = false; // Esconde o spinner quando o processo for concluído
      },
      (error) => {
        console.log(error);
        // Esconda o spinner quando o processo for concluído
        this.spinner.hide();
        this.showSpinner = false;
        this.notificacaoService
          .AlertaErro(
            'Erro',
            'Erro ao tentar entrar, contate o administrador do sistema',
            'Concluir'
          )
          .then(() => {
            window.location.reload();
          });
      }
    );
  }
}
