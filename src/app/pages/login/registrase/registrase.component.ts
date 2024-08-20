import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistraseService } from 'src/app/services/login/registrase/registrase.service';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrase',
  templateUrl: './registrase.component.html',
  styleUrls: ['./registrase.component.css'],
})
export class RegistraseComponent implements OnInit {
  cadastroForm: FormGroup;
  perfis: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private registraseService: RegistraseService,
    private notificacaoService: NotificacaoService,
    private router: Router,
  ) {
    this.cadastroForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.listarPerfisDeAcesso();

    this.cadastroForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      roleid: ['Perfil de Acesso', Validators.required]
    });
  }

  listarPerfisDeAcesso(): void {
    this.registraseService.listarPerfisDeAcesso().subscribe(
      (response) => {
        this.perfis = response;
      },
      (error) => {
        this.notificacaoService
          .AlertaErro('Erro', 'Erro ao listar os Perfis de Acesso!', 'Concluir')
          .then(() => {
            window.location.reload();
          });
      }
    );
  }

  onSubmit(): void {

    if (this.cadastroForm.valid) {
      const cadastroData = this.cadastroForm.value;
      if (this.cadastroForm.value.roleid === 'Perfil de Acesso') {
        this.notificacaoService.AlertaErro(
          'Erro',
          'Por favor, selecione o Perfil de Acesso.',
          'Concluir'
        );
        return; 
      }

      this.registraseService.registrarUsuario(cadastroData).subscribe(
        (response) => {
          // Lógica de sucesso do cadastro aqui
          console.log('Cadastro realizado com sucesso!', response);
          this.notificacaoService
            .AlertaConcluidoAzul(
              'Sucesso',
              'Perfil cadastrado com sucesso!',
              'Concluir'
            )
            .then(() => {
              this.router.navigate(['/login']);
            });
        },
        (error) => {
          // Lógica de tratamento de erro aqui
          console.error('Erro ao cadastrar:', error.error.message);
          this.notificacaoService
            .AlertaErro('Erro', error.error.message, 'Concluir')
            .then(() => {
              window.location.reload();
            });
        }
      );
    } else {
      // Exiba mensagens de validação se o formulário for inválido
      this.cadastroForm.markAllAsTouched();
      this.notificacaoService
        .AlertaErro('Erro', 'Seu E-mail não corresponde!', 'Concluir')
        .then(() => {
          window.location.reload();
        });
    }
  }
}
