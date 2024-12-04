import { DomSanitizer } from '@angular/platform-browser';
import Command from '../command';
import { EditorMediator } from '../../mediator/editor_mediator';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { TemplateService } from 'src/app/services/template/template.service';
import Swal from 'sweetalert2';
import { EmailService } from 'src/app/services/email/email.service';

type Params = {
  templateStatus: number;
  mediator: EditorMediator;
};

export class DownloadHtmlCommand extends Command {
  templateStatus: number;
  mediator: EditorMediator;
  notificacaoService: NotificacaoService;
  templateService: TemplateService;
  elRef: ElementRef;
  router: Router;

  constructor(
    private params: Params,
    notificacaoService: NotificacaoService,    // Inject service
    templateService: TemplateService,          // Inject service
    elRef: ElementRef,                         // Inject reference
    router: Router                             // Inject Router
  ) {
    super();
    this.templateStatus = params.templateStatus;
    this.mediator = params.mediator;
    this.notificacaoService = notificacaoService; // Assign injected service
    this.templateService = templateService;       // Assign injected service
    this.elRef = elRef;                          // Assign reference
    this.router = router;                        // Assign Router
  }

  override execute(): void {
    this.saveHtml(this.templateStatus);
  }
 

  downloadHTML(html: string, filename: string) {
    // Regex para capturar imagens com atributo específico
    const imgRegex = /<img[^>]+data-replaceable-image[^>]*src="(.*?)"/g;
    const matches = Array.from(html.matchAll(imgRegex));

    for (const match of matches) {
      const imgSrc = match[1];
      const imageName = imgSrc.split('/').pop();
      const imagePath = `https://vivoid.vivo.com.br/creatorPlay/${imageName}`;

      // Substitui o caminho base64 pelo caminho correto no servidor
      html = html.replace(imgSrc, imagePath);
    }

    console.log('HTML após substituição:', html);

    // Remover atributos editáveis do HTML
    html = this.removeContentEditable(html);

    const blob = new Blob([html], { type: 'text/html' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  removeContentEditable(html: string): string {
    // Cria um elemento DOM temporário para manipulação
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove o atributo contenteditable de todos os elementos
    const elements = tempDiv.querySelectorAll('[contenteditable]');
    elements.forEach((element) => {
      element.removeAttribute('contenteditable');
    });

    return tempDiv.innerHTML;
  }

  async saveHtml(templateStatus: number) {
    debugger;
    const name: string = (await this.notificacaoService.AlertaNomeTemplate()) ?? 'Template';
    const tStatus = templateStatus;

    const headerContainer = document.querySelector('#header-container');
    const contentContainer = document.querySelector('#content-container');
    const footerContainer = document.querySelector('#footer-container');


    if (headerContainer && contentContainer && footerContainer) {
      const headerHTML = headerContainer.outerHTML;
      const contentHTML = contentContainer.outerHTML;
      const footerHTML = footerContainer.outerHTML;

      const combinedHTML = `${headerHTML}${contentHTML}${footerHTML}`;
      const cleanedHTML = this.removeContentEditable(combinedHTML);
      const result = this.removeDisplayNone(cleanedHTML);
      
      // Converte o array em string JSON para passar para o método saveDbTemplate
      this.saveDbTemplate(
        name,
        tStatus,
        result
      );
  
      // Salva no banco e realiza o download do HTML.
      this.saveDbTemplate(name, tStatus, combinedHTML);
      this.downloadHTML(result, `${name}.html`);
    }
  }

  async saveHtmlAndExit(templateStatus: number) {
    debugger;
    const name: string = (await this.notificacaoService.AlertaNomeTemplate()) ?? 'Template';
    const tStatus = templateStatus;

    const headerContainer = document.querySelector('#header-container');
    const contentContainer = document.querySelector('#content-container');
    const footerContainer = document.querySelector('#footer-container');


    if (headerContainer && contentContainer && footerContainer) {
      const headerHTML = headerContainer.outerHTML;
      const contentHTML = contentContainer.outerHTML;
      const footerHTML = footerContainer.outerHTML;

      const combinedHTML = `${headerHTML}${contentHTML}${footerHTML}`;
      const cleanedHTML = this.removeContentEditable(combinedHTML);
      const result = this.removeDisplayNone(cleanedHTML);

      // Converte o array em string JSON para passar para o método saveDbTemplate
      this.saveDbTemplate(
        name,
        tStatus,
        result
      );
      
      this.router.navigate(['/inicio']); // Redireciona após salvar
    }
     else {
      this.notificacaoService
            .AlertaErro('Erro', 'Conteúdo Nullo', 'Concluir')
            .then(() => {
              // this.router.navigate(['/login']);
            });
     }
  }
  

  saveDbTemplate(
    name: string,
    templateStatus: number,
    template: string,  ) {
   


    debugger;
    const templatePayload = {
      name: name,
      template: template,
      templateStatus: templateStatus,
    };

    this.templateService.saveTemplate(templatePayload).subscribe({
      next: (response) => {
        debugger;
        if (templateStatus === 0) {
          this.notificacaoService
            .AlertaConcluidoAzul('Sucesso', response.message, 'Concluir')
            .then(() => {
              // this.router.navigate(['/login']);
            });
        }
      },
      error: (error) => {
        debugger;
        this.notificacaoService
          .AlertaErro('Erro', error.error.message, 'Concluir')
          .then(() => {});
      },
      complete: () => {},
    });
  }

  async AlertaNomeTemplate(): Promise<string | undefined> {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Nome do template',
      inputValidator: (value: any) => {
        if (!value) {
          return 'Você precisa digitar algo!';
        }
        return undefined; // Adicionando retorno explícito para todos os caminhos
      },
      showCancelButton: false,
    });

    if (text) {
      console.log('nameTemplate ', text);
      return text;
    }
    return undefined;
  }


  

 

  

  removeDisplayNone(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const elements = tempDiv.querySelectorAll('[style*="display: none"]')
    elements.forEach((e) => e.parentElement?.removeChild(e))
    return tempDiv.innerHTML;
  }
}
