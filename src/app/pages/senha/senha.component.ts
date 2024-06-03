import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/helpService/Auth.service';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { SenhaService } from 'src/app/services/senha/senha.service';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.css'],
})
export class SenhaComponent implements OnInit {
  trocaSenhaForm: FormGroup;
  userId: string | null = null; // Inicialize a propriedade userId com null
  showSpinner: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private senhaService: SenhaService,
    private authService: AuthService,
    private notificacaoService: NotificacaoService
  ) {
    this.trocaSenhaForm = this.formBuilder.group({
      senha: ['', Validators.required],
      novaSenha: ['', Validators.required],
      confirmacaoSenha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getStoredUserId();
    console.log('ID do usuário logado:', this.userId);
  }

  TrocarSenha(): void {
    this.showSpinner = true; // Exibe o spinner
    if (this.trocaSenhaForm.valid && this.userId) {
      const senhaModel = {
        id: this.userId,
        senha: this.trocaSenhaForm.value.senha,
        novaSenha: this.trocaSenhaForm.value.novaSenha,
        confirmacaoSenha: this.trocaSenhaForm.value.confirmacaoSenha,
      };

      this.senhaService.trocarSenha(senhaModel).subscribe(
        (response) => {
          this.showSpinner = false; // Esconde o spinner quando o processo for concluído
          console.log('Senha alterada com sucesso!');
          this.notificacaoService
            .AlertaConcluidoAzul(
              'Sucesso',
              'Senha alterada com sucesso!',
              'Concluir'
            )
            .then(() => {
              this.trocaSenhaForm.reset(); // Limpa o formulário
            });
        },
        (error) => {
          this.showSpinner = false; // Esconde o spinner quando o processo for concluído

          console.error('Ocorreu um erro ao alterar a senha:', error);
          this.notificacaoService
            .AlertaErro('Erro', 'Senhas não correspondente!', 'Concluir')
            .then(() => {
              this.trocaSenhaForm.reset(); // Limpa o formulário
            });
        }
      );
    } else {
      this.showSpinner = false; // Esconde o spinner quando o processo for concluído

      console.log('Formulário inválido');
    }
  }
}
