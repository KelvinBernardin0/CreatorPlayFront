import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, take } from 'rxjs/operators';
import { AutenticacaoToken } from './autenticacao.token';
declare var $: any;

import { DatePipe } from '@angular/common';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { LogGeralService } from 'src/app/services/helpService/log-geral.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
  href: string = '';
  formData = new FormData();
  QuantidadeErro: number = 0;
  Url: string = '';
  constructor(
    private router: Router,
    private autenticacaoToken: AutenticacaoToken,
    private spinner: NgxSpinnerService,
    private notificacaoService: NotificacaoService,
    private logGeralService: LogGeralService,
    private datePipe: DatePipe
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let hrf = $(document).prop('title');
    if (hrf != this.href && this.router.url != '/Autenticacao') {
      this.href = $(document).prop('title');
      //REQUEST PARA SALVAR LOG NO BANCO DE DADOS !
    }
    if (this.autenticacaoToken.Token()) {
      const clonedreq = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('JwtToken')
        ),
      });

      return next.handle(clonedreq).pipe(
        tap(
          (succ) => {
            if (this.Url != clonedreq.url) {
              this.QuantidadeErro = 0;
            }
          },
          (err) => {
            // if (err.status === 400) {
            //   this.notificacaoService.AlertaErro(
            //     'Oferta não encontrada!',
            //     'Não encontramos a oferta, estaremos te redirecionando para o início!',
            //     'Fechar'
            //   );
            //   return;
            // }
            if (err.status === 403) {
              this.notificacaoService.AlertaErro(
                'Não Autorizado!',
                'Você não tem permissão para acessar os dados desta página!',
                'Fechar'
              );
              return;
            }
            if (err.status === 401) {
              this.router.navigateByUrl('/Erro/SessaoExpirada');
              return;
            } else {
              if (this.QuantidadeErro < 2) {
                // this.notificacaoService.AlertaErro(
                //   'Oops...',
                //   'Alguma coisa deu errado, tente novamente. Se o erro persistir, abra um chamado para nosso time.',
                //   'Fechar'
                // );
              }

              if (this.QuantidadeErro == 2) {
                this.notificacaoService
                  .AlertaErroConfirmacao(
                    'Oops...',
                    'Alguma coisa deu errado, tente novamente. Se o erro persistir, abra um chamado para nosso time.',
                    'Abrir um Chamado',
                    'Fechar'
                  )
                  .then((r) => {
                    if (r.isConfirmed) {
                      // this.router.navigate(['/AppCliente/Home/' + this.NumeroDocumento])
                      //   .then(() => {
                      //     // window.location.reload();
                      //   });

                      alert('Colocar API de Abrir Chamado');
                    }
                  });
                this.QuantidadeErro = 0;
              }

              this.PutLogErro(err);
              this.QuantidadeErro = this.QuantidadeErro + 1;
              this.Url = err.url;
            }
          }
        )
      );
    } else {
      return next.handle(req.clone()).pipe(
        tap(
          (succ) => {},
          (err) => {
            if (err.status === 401) {
              this.router.navigateByUrl('/Erro/SessaoExpirada');
            } else {
              //QUALQUER TIPO DE ERRO !
              // this.PutLogErro(err);
              this.spinner.hide();
            }
            this.spinner.hide();
          }
        )
      );
    }
  }

  PutLogErro(erro: any) {
    let ErroAtual = localStorage.getItem('ErroUsuario');
    let ErroData: any = localStorage.getItem('ErroData');

    if (ErroAtual == erro.error.retorno) {
      this.spinner.hide();
      return;
    }

    if (
      ErroData == String(this.datePipe.transform(new Date(), 'yyyyMMddHHmm'))
    ) {
      this.spinner.hide();
      return;
    }

    localStorage.setItem('ErroUsuario', erro.error.retorno);
    localStorage.setItem(
      'ErroData',
      String(this.datePipe.transform(new Date(), 'yyyyMMddHHmm'))
    );

    this.formData = new FormData();
    this.formData.append('Status', erro.status.toString());
    this.formData.append('Erro', erro.error.retorno);
    this.formData.append('Url', erro.url);
    this.logGeralService.PutLogErro(this.formData).subscribe(
      (data: any) => {},
      (err: Error) => {
        this.spinner.hide();
      }
    );

    this.spinner.hide();
  }
}
