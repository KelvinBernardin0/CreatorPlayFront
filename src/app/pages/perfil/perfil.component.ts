import { AuthService } from 'src/app/services/helpService/Auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { PerfilModel } from 'src/app/models/perfil/perfil-model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  perfil: PerfilModel = new PerfilModel(); // Inicialize o objeto perfil
  showSpinner: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private notificacaoService: NotificacaoService
  ) {
    this.perfilForm = this.formBuilder.group({
      id: ['', Validators.required],
      usuario: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
    });
  }

  ngOnInit(): void {
    this.carregarPerfilUsuario();
  }

  carregarPerfilUsuario(): void {
    this.showSpinner = true; // Exibe o spinner (carregamento)

    const token = localStorage.getItem('JwtTokenBearer');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });

      this.perfilService.obterPerfilUsuario(headers).subscribe(
        (response) => {
          this.showSpinner = false; // Esconda o spinner quando o processo for concluído

          const responseData = response as any;
          if (responseData) {
            this.perfil = responseData;

            this.perfilForm.patchValue({
              id: this.perfil.id,
              usuario: this.perfil.usuario,
              email: this.perfil.email,
              telefone: this.perfil.telefone,
            });
          } else {
            console.error('Dados do perfil não encontrados');
          }
        },
        (error) => {
          console.error('Erro ao carregar o perfil do usuário:', error);
        }
      );
    } else {
      console.error('Token não encontrado');
    }
  }

  enviarEmailVerificacao(): void {
    console.log('Enviar e-mail de verificação para: ', this.perfil.email);
  }

  atualizarPerfil(): void {
    this.showSpinner = true; // Exibe o spinner
    if (this.perfilForm.valid) {
      this.perfil.id = this.perfilForm.value.id;
      this.perfil.usuario;
      this.perfil.email = this.perfilForm.value.email;
      this.perfil.telefone = this.perfilForm.value.telefone;

      this.perfilService.atualizarPerfil(this.perfil).subscribe(
        (response) => {
          this.showSpinner = false; // Esconda o spinner quando o processo for concluído

          console.log('Perfil atualizado com sucesso!');
          this.notificacaoService
            .AlertaConcluidoAzul(
              'Sucesso',
              'Perfil atualizado com sucesso!',
              'Concluir'
            )
            .then(() => {
              this.perfilForm.reset(); // Limpa o formulário
              this.carregarPerfilUsuario(); // Carrega o perfil do usuário
            });
        },
        (error) => {
          this.showSpinner = false; // Esconda o spinner quando o processo for concluído

          console.error('Erro ao atualizar o perfil:', error);
          console.log(error.error);
          this.notificacaoService
            .AlertaErro('Erro', 'Erro ao atualizar o perfil!', 'Concluir')
            .then(() => {
              this.perfilForm.reset(); // Limpa o formulário
              this.carregarPerfilUsuario(); // Carrega o perfil do usuário
            });
        }
      );
    } else {
      this.showSpinner = false; // Esconda o spinner quando o processo for concluído

      // Exiba mensagens de validação se o formulário for inválido
      this.notificacaoService
        .AlertaErro('Erro', 'Seu E-mail não corresponde!', 'Concluir')
        .then(() => {
          this.perfilForm.reset(); // Limpa o formulário
          this.carregarPerfilUsuario(); // Carrega o perfil do usuário
        });
    }
  }
}
