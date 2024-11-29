import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { HistoricoService } from 'src/app/services/historico/historico.service';
import { TemplateService } from 'src/app/services/template/template.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent {
  emailHTML: string = '';
  showSpinner: boolean = false;
  templates: any[] = [];
  generatedTemplate: string = '';
  template!: any; // Variável para armazenar o template
  options!: any; // Variável para armazenar o template
  templatesFiltrados: any[] = [];
  abaAtiva: string = 'Concluído'; // Aba ativa inicial


  constructor(
    private router: Router,
    private http: HttpClient,
    private notificacaoService: NotificacaoService,
    private historicoService: HistoricoService,
    private templateService: TemplateService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getTemplate();
  }

  getTemplate(): void {
    this.showSpinner = true;
    this.historicoService.getTemplate().subscribe(
      (response) => {
        this.showSpinner = false;
        this.templates = response;
        this.filtrarTemplates();
        debugger;
      },
      (error) => {
        this.showSpinner = false;
        console.error('Erro ao listar Templates:', error);
        this.notificacaoService.AlertaErro(
          'Erro',
          'Erro ao listar Templates!',
          'Concluir'
        );
      }
    );
  }

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
    this.filtrarTemplates();
  }

  filtrarTemplates(): void {
    debugger;
    this.templatesFiltrados = this.templates.filter((template) =>
      this.abaAtiva === 'Concluído'
        ? template.templateStatus === 'Concluído'
        : template.templateStatus === 'Rascunho'
    );
  }



  redirecionarParaEmail(template: any) {
    debugger;

    this.template = template.template; // Acessa template.template
    this.options = template.options; // Acessa template.template
    // Salvar o template no localStorage
    localStorage.setItem('emailTemplate', template.template);
    localStorage.setItem('Visoes', template.options);

    // Chama o método para redirecionar para a página de email
    this.carregarEmail(this.template, [this.options]);
  }

  carregarEmail(template: string, opcoesVisiveis: string[]) {
    // O template já é uma string, então redireciona diretamente
    this.router.navigate(['/email'], {
      queryParams: {
        template: template, // Passa o conteúdo HTML como string
        opcoesVisiveis: opcoesVisiveis.join(','), // Passa as opções visíveis
      },
    });
  }



  async saveChanges(completeHTML: string) {
    const name: string =
      (await this.notificacaoService.AlertaNomeTemplate()) ?? '';
    if (name && name !== '') {
      // Chama o método para gerar o HTML completo
      const { completeHTML: fullHTML } = this.generatorTemplateHtml(completeHTML); // Pega as partes do HTML
      
      // Faz o download do HTML completo
      this.downloadHTML(fullHTML, name + '.html'); // Faz download do HTML completo
    }
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
    // Usar regex para remover os atributos id="editavel" e contenteditable="true" sem afetar as tags de nível superior
    html = html.replace(/ id="editavel"/g, ' id="editavel2"');
    html = html.replace(/ contenteditable="true"/g, '');

    // Remover a div com id="excluirStyle"
    html = html.replace(/<div id="excluirStyle">[\s\S]*?<\/div>/g, '');

    return html;
  }

  generatorTemplateHtml(templateHTML: string): { completeHTML: string } {


    // Estrutura HTML completa dentro de uma string, para evitar manipulação DOM
  const completeHTML: string = `
<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="referrer" content="no-referrer" />
      <!--[if !mso]><!-->
    <title>E-mail</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
    img {
    -ms-interpolation-mode:bicubic;
    }
    a[x-apple-data-detectors],
    .unstyle-auto-detected-links a,
    .aBn {
    border-bottom: 0 !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    }
    .im {
    color: inherit !important;
    }
    .a6S {
    display: none !important;
    opacity: 0.01 !important;
    }
    img.g-img + div {
    display: none !important;
    }
    .ReadMsgBody {
      width:100%;
      }
      .ExternalClass {
      width:100%;
      }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
      line-height: 100%;
      }
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u ~ div .email-container {
      min-width: 320px !important;
      margin: 0 auto !important;
      }
      }
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u ~ div .email-container {
      min-width: 375px !important;
      margin: 0 auto !important;
      }
      }
      @media only screen and (min-device-width: 414px) {
      u ~ div .email-container {
      min-width: 414px !important;
      margin: 0 auto !important;
      }
      }
  </style>
  <!--[if mso]>     <noscript>     <xml>     <o:OfficeDocumentSettings>       <o:AllowPNG/>       <o:PixelsPerInch>96</o:PixelsPerInch>     </o:OfficeDocumentSettings>     </xml>     </noscript>     <![endif]-->
  <!--[if lte mso 11]>     <style type="text/css">       .mj-outlook-group-fix { width:100% !important; }     </style>     <![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-90 {
        width: 90% !important;
        max-width: 90%;
      }

      .mj-column-per-92 {
        width: 92% !important;
        max-width: 92%;
      }

      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
      width: 100% !important;
      max-width: 100%;
    }

    .moz-text-html .mj-column-per-90 {
      width: 90% !important;
      max-width: 90%;
    }

    .moz-text-html .mj-column-per-92 {
      width: 92% !important;
      max-width: 92%;
    }

    .moz-text-html .mj-column-per-50 {
      width: 50% !important;
      max-width: 50%;
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
  <style type="text/css">
    @media screen and (max-width: 600px) {
      *.hideThis {
        display: none !important;
      }
    }

    li {
      color: #99CC33
    }

    @media all and (max-width:480px) {
      .mobile-center div {
        text-align: center !important;
        padding: 10px 0px 0 0px
      }

      .mobile-center-02 div {
        text-align: center !important;
        padding: 0px 0px 0 0px
      }

      .mobile-center-cta div {
        text-align: center !important;
        padding: 0px 30px 0 30px
      }
    }

    @media (max-width: 600px) {
      .table-column {
        width: 100% !important;
        display: block;
        text-align: center;
      }
    }
  </style>

  <style>
    .button-td,
    .button-a {
    transition: all 100ms ease-in;
    }
    @media screen and (max-width: 600px) {
    .email-container {
    width: 100% !important;
    margin: auto !important;
    }
    .col-,
    .col-center {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    direction: ltr !important;
    }
    .col-center {
    text-align: center !important;
    }
    .center-on-narrow {
    text-align: center !important;
    display: block !important;
    margin-left: auto !important;
    margin-right: auto !important;
    float: none !important;
    }
    table.center-on-narrow {
    display: inline-block !important;
    }
    .hideThis { display: none !important; }
    .txt-left {text-align: left!important;}
    .f-left {float: left!important;}
    .pdx10 {padding-left: 10px!important; padding-right: 10px!important;}
    .pdx20 {padding-left: 20px!important; padding-right: 20px!important;}
    .top0 {padding-top: 0!important;}
    .mx-auto{display: block!important; margin: 0 auto!important; float: none!important; text-align: center!important;}
    }
</style>

 <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-32 {
        width: 32% !important;
        max-width: 32%;
      }

      .mj-column-per-2 {
        width: 2% !important;
        max-width: 2%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-32 {
      width: 32% !important;
      max-width: 32%;
    }

    .moz-text-html .mj-column-per-2 {
      width: 2% !important;
      max-width: 2%;
    }
  </style>

    <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-35 {
        width: 35% !important;
        max-width: 35%;
      }

      .mj-column-per-2 {
        width: 2% !important;
        max-width: 2%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-35 {
      width: 35% !important;
      max-width: 35%;
    }

    .moz-text-html .mj-column-per-2 {
      width: 2% !important;
      max-width: 2%;
    }
  </style>
   <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-48 {
        width: 48% !important;
        max-width: 48%;
      }

      .mj-column-per-4 {
        width: 4% !important;
        max-width: 4%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-48 {
      width: 48% !important;
      max-width: 48%;
    }

    .moz-text-html .mj-column-per-4 {
      width: 4% !important;
      max-width: 4%;
    }
  </style>
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-90 {
        width: 90% !important;
        max-width: 90%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-90 {
      width: 90% !important;
      max-width: 90%;
    }
  </style>

  <style type="text/css">
    @media screen and (max-width: 600px) {
      *.hideThis {
        display: none !important;
      }
    }

    li {
      color: #99CC33
    }

    @media all and (max-width:480px) {
      .mobile-center div {
        text-align: center !important;
        padding: 10px 0px 0 0px
      }

      .mobile-center-02 div {
        text-align: center !important;
        padding: 0px 0px 0 0px
      }

      .mobile-center-cta div {
        text-align: center !important;
        padding: 0px 30px 0 30px
      }
    }

    @media (max-width: 600px) {
      .table-column {
        width: 100% !important;
        display: block;
        text-align: center;
      }
    }
  </style>
  </head>

  <body style="word-spacing: normal">
    ${templateHTML}
    <custom name="opencounter" type="tracking">
  </body>
</html>
    `;

    return { completeHTML }; // Retorna o HTML completo
  }
}
