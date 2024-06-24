import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
interface OpcaoHeader {
  nome: string;
  path: string;
  html?: string;
}
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
})
export class EmailComponent {
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';

  headerHTML: SafeHtml = '';
  contentHTML: SafeHtml = '';
  footerHTML: SafeHtml = '';

  undoStack: { header: string, content: string, footer: string }[] = [];

  mostrarPropriedades: boolean = true;
  mostrarHeader: boolean = false;
  mostrarFooter: boolean = false;
  mostrarTipografia: boolean = false;
  mostrarImagem: boolean = false;
  mostrarBotao: boolean = false;
  mostrarCards: boolean = false;
  mostrarPlanos: boolean = false;
  mostrarVitrine: boolean = false;

  opcoesPropriedades: { nome: string; html: string }[] = [];
  opcoesPropriedadesEmpresas: { nome: string; html: string }[] = [];
  opcoesHeaders!: OpcaoHeader[];
  opcoesFooters: { nome: string; html: string }[] = [];
  opcoesTitulos: { nome: string; html: string }[] = [];
  opcoesDescricoes: { nome: string; html: string }[] = [];
  opcoesLinks: { nome: string; html: string }[] = [];
  opcoesBotoes: Array<{ nome: string, path: string }> = [];
  opcoesCards: { nome: string; html: string }[] = [];
  opcoesPlanos: { nome: string; html: string }[] = [];
  opcoesVitrineEquipamento: { nome: string; html: string }[] = [];
  opcoesVitrinePlanos: { nome: string; html: string }[] = [];
  
  currentRange: Range | null = null; //Para armazenar a posição atual do cursor

  selectedImageSize: string = 'G'; //Tamanho padrão da imagem
  lastUploadedImg: HTMLImageElement | null = null; // Para armazenar a última imagem carregada
  termosDeUsoAceitos: boolean = false;

  selectedBackgroundColor = ''; // Cor de fundo selecionada

  selectedImageElement: HTMLElement | null = null;

  
  @ViewChild('contentContainer', { static: false }) contentContainerRef!: ElementRef;
  @ViewChild('headerContainer', { static: false }) headerContainerRef!: ElementRef;
  @ViewChild('footerContainer', { static: false }) footerContainerRef!: ElementRef;
  @ViewChild('emailContainer') emailContainerRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private http: HttpClient,
    private elRef: ElementRef
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['emailHTML']) {
        this.rawEmailHTML = params['emailHTML'];
        this.divideHTML(this.rawEmailHTML);
      }

      this.saveState(); // Salvar o estado antes de fazer a alteração
    });
  }

  //---------------- FUNCIONAMENTO DO HTML ----------------
  //CARREGAR PROPRIEDADES INICIAIS DO EMAIL HTML
  carregarEmail(url: string) {
      this.http.get(url, { responseType: 'text' }).subscribe((data) => {
        this.emailHTML = data;
        this.router.navigate(['/email'], {
          queryParams: { emailHTML: this.emailHTML },
        });
      });
  }

  //DIVIDINDO HTML EM 3 PARTES
  divideHTML(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const headerElement = doc.querySelector('#header-container');
    const contentElement = doc.querySelector('#content-container');
    const footerElement = doc.querySelector('#footer-container');

    this.headerHTML = this.sanitizer.bypassSecurityTrustHtml(
      headerElement ? headerElement.innerHTML : ''
    );
    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(
      contentElement ? contentElement.innerHTML : ''
    );
    this.footerHTML = this.sanitizer.bypassSecurityTrustHtml(
      footerElement ? footerElement.innerHTML : ''
    );
  }

  //A função makeEditable armazena a posição do cursor atual na variável 
  //currentRange sempre que o usuário clica dentro da área editável
  makeEditable(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.nodeType === 1) {
      target.setAttribute('contenteditable', 'true');
    }
  
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.currentRange = selection.getRangeAt(0);
    }
  
    // Limpe a última imagem carregada ao tornar o conteúdo editável novamente
    this.lastUploadedImg = null;
  }

  // Função chamada quando o usuário inicia o arraste de um card
  onDragStart(event: DragEvent, opcao: any) {
    this.saveState(); // Salvar o estado antes de fazer a alteração

    event.dataTransfer?.setData('text/html', opcao.html);
  }

  // Função chamada quando o usuário solta um card no conteúdo editável
  onDrop(event: DragEvent) {

    event.preventDefault();
    const htmlContent = event.dataTransfer?.getData('text/html');
    if (htmlContent) {
      this.saveState(); // Salvar o estado antes de fazer a alteração

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const fragment = range.createContextualFragment(htmlContent);
        range.insertNode(fragment);
      }
    }
  }

  // Função para permitir soltar elementos arrastados no conteúdo editável
  onDragOver(event: DragEvent) {
    this.saveState(); // Salvar o estado antes de fazer a alteração

    event.preventDefault();
  }

  // Função para atualizar o HTML após as mudanças
  atualizarHTML() {

    const headerContainer = document.getElementById('header-container');
    const contentContainer = document.getElementById('content-container');
    const footerContainer = document.getElementById('footer-container');

    if (headerContainer && contentContainer && footerContainer) {
      const headerHTML = headerContainer.innerHTML;
      const contentHTML = contentContainer.innerHTML;
      const footerHTML = footerContainer.innerHTML;

      // Atualiza o conteúdo HTML bruto e seguro para cada parte
      this.headerHTML = this.sanitizer.bypassSecurityTrustHtml(headerHTML);
      this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(contentHTML);
      this.footerHTML = this.sanitizer.bypassSecurityTrustHtml(footerHTML);
    }
  }
  //---------------- FIM DO FUNCIONAMENTO DO HTML ----------------


  //---------------- CARREGAR HERADES ----------------
  carregarOpcoesHeaders() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = true; //MOSTRAR
    this.mostrarFooter = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesHeaders = [];
    const tamanhos = [
      {
        nome: 'Imagem Grande',
        path: 'assets/componentes/headers/headers_imagem_grande.html',
      },
      {
        nome: 'Imagem Grande Inverso',
        path: 'assets/componentes/headers/headers_imagem_grande_inverso.html',
      },
      {
        nome: 'Imagem Pequena',
        path: 'assets/componentes/headers/headers_imagem_pequena.html',
      },
      {
        nome: 'Imagem Pequena Inverso',
        path: 'assets/componentes/headers/headers_imagem_pequena_inverso.html',
      },
      {
        nome: 'Sem Imagem',
        path: 'assets/componentes/headers/headers_sem_imagem.html',
      },
      {
        nome: 'Sem Imagem Inverso',
        path: 'assets/componentes/headers/headers_sem_imagem_inverso.html',
      },
    ];

    tamanhos.forEach((opcao) => {
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesHeaders.push({
          nome: opcao.nome,
          path: opcao.path,
          html: data,
        });
      });
    });
  }
  //---------------- FIM CARREGAR HERADES ----------------


  //---------------- CARREGAR FOOTERS ----------------
  carregarOpcoesFooters() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false;
    this.mostrarFooter = true; //MOSTRAR
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesFooters = [];
    const tamanhos = [
      {
        nome: 'Footer Roxo',
        path: 'assets/componentes/footers/footer.html',
      },
      {
        nome: 'Footer Branco',
        path: 'assets/componentes/footers/footer_inverso.html',
      },
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesFooters.push({ nome: opcao.nome, html: data });
      });
    });
  }
  //---------------- FIM CARREGAR FOOTERS ----------------


  //---------------- INICIO DAS PROPRIEDADES ----------------
  carregarOpcoesPropriedades() {
    this.mostrarPropriedades = true;//MOSTRAR
    this.mostrarHeader = false;
    this.mostrarFooter = false; 
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesPropriedadesEmpresas= [];
    const tamanhos = [
      {
        nome: 'botao1',
        path: 'assets/componentes/propriedades/botao1.png',
      },
      { nome: 'botao2', 
        path: 'assets/componentes/propriedades/botao2.png' 
      },
      {
        nome: 'botao3',
        path: 'assets/componentes/propriedades/botao3.png',
      }
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesPropriedadesEmpresas.push({ nome: opcao.nome, html: data });
      });
    });
  }
  
  mudarCorFundo(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'branco':
        this.selectedBackgroundColor = '#FFFFFF';
        break;
      case 'cinza':
        this.selectedBackgroundColor = '#666666';
        break;
      case 'roxo':
        this.selectedBackgroundColor = '#49066B';
        break;
      default:
        this.selectedBackgroundColor = 'transparent';
        break;
    }
  }
  //---------------- FIM DAS PROPRIEDADES ----------------


  //---------------- CARREGAR TEXTOS ----------------
  carregarOpcoesTipografias() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false;
    this.mostrarFooter = false;
    this.mostrarTipografia = true; //MOSTRAR TIPOGRAFIAS
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesTitulos= [];
    const tamanhos = [
      {
        nome: 'H1 Branco',
        path: 'assets/componentes/tipografia/H1_Branco.html',
      },
      { nome: 'H1 Roxo', path: 'assets/componentes/tipografia/H1_Roxo.html' },

      {
        nome: 'H2 Branco',
        path: 'assets/componentes/tipografia/H2_Branco.html',
      },
      { nome: 'H2 Roxo', path: 'assets/componentes/tipografia/H2_Roxo.html' },

      {
        nome: 'H3 Branco',
        path: 'assets/componentes/tipografia/H3_Branco.html',
      },
      { nome: 'H3 Roxo', path: 'assets/componentes/tipografia/H3_Roxo.html' },
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesTitulos.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesDescricoes = [];
    const descricoes = [
      {
        nome: 'Descrição Cinza 16px',
        path: 'assets/componentes/tipografia/DescricaoCinza_FonteSize16px.html',
      },
      {
        nome: 'Descrição Cinza 14px',
        path: 'assets/componentes/tipografia/DescricaoCinza_FonteSize14px.html',
      },
      {
        nome: 'Descrição Branca 16px',
        path: 'assets/componentes/tipografia/DescricaoBranca_FonteSize16px.html',
      },
      {
        nome: 'Descrição Branca 14px',
        path: 'assets/componentes/tipografia/DescricaoBranca_FonteSize14px.html',
      },
    ];

    descricoes.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesDescricoes.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesLinks = [];
    const links = [
      {
        nome: 'Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'Sublinhado Branco 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize12px.html',
      },
      {
        nome: 'S/ Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'S/ Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'S/ Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'S/ Sublinhado Branco 12px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize12px.html',
      },
    ];

    links.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesLinks.push({ nome: opcao.nome, html: data });
      });
    });
  }

  // Aplica a cor selecionada ao texto selecionado
  AplicaCor(cor: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.saveState(); // Salvar o estado antes de fazer a alteração
  
      const range = selection.getRangeAt(0);
      const selectedContents = range.extractContents();
      const span = document.createElement('span');
      span.style.color = cor;

  
      span.appendChild(selectedContents);
      range.insertNode(span);
  
      // Atualiza o HTML após aplicar a cor
      this.atualizarHTML();
    }
  }
  


  // Aplica o estilo selecionado ao texto selecionado
  aplicaEstiloSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return; // Retorna se nenhum valor estiver selecionado

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return; // Retorna se não houver seleção

    this.saveState(); // Salvar o estado antes de fazer a alteração

    const range = selection.getRangeAt(0);
    const selectedContents = range.extractContents();

    const span = document.createElement('span');
    switch (selectedValue) {
      case 'bold':
        span.style.fontWeight = 'bold';
        break;
      case 'italic':
        span.style.fontStyle = 'italic';
        break;
      case 'underline':
        span.style.textDecoration = 'underline';
        break;
      default:
        break;
    }

    span.appendChild(selectedContents);
    range.insertNode(span);

    // Atualiza o HTML após aplicar o estilo
    this.atualizarHTML();
  }



  // INSERIR LINK
  inserirLink() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer as HTMLElement;

      const imgElement = container.querySelector('img');
      if (imgElement) {
        let link = prompt('Digite o URL do link:');
        if (link) {
          // Verificar se o link é relativo e convertê-lo para absoluto
          if (!link.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
            link = 'https://' + link;
          }

          const aElement = document.createElement('a');
          aElement.href = link;
          aElement.target = '_blank';
          aElement.title = link; // Define o tooltip para exibir o link

          // Clonar a imagem e adicionar ao link
          const imgClone = imgElement.cloneNode(true);
          aElement.appendChild(imgClone);

          this.saveState(); // Salvar o estado antes de fazer a alteração

          // Substituir a imagem original pelo link com a imagem clonada
          imgElement.parentNode?.replaceChild(aElement, imgElement);

          // Atualizar o HTML
          this.atualizarHTML();
        }
      } else {
        alert('Por favor, selecione uma imagem primeiro.');
      }
    }
  }

  //---------------- FIM CARREGAR TEXTOS ----------------


  //---------------- CARREGAR BOTOES ----------------
  carregarOpcoesBotoes() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false;
    this.mostrarFooter = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = true; //MOSTRAR BOTOES
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesBotoes = [
      { nome: 'btn_acesse', path: 'assets/componentes/botoes/btn_acesse.png' },
      { nome: 'btn_acesse_inverse', path: 'assets/componentes/botoes/btn_acesse_inverse.png' },
      { nome: 'btn_acesse_inverse_small', path: 'assets/componentes/botoes/btn_acesse_inverse_small.png' },
      { nome: 'btn_acesse_secondary', path: 'assets/componentes/botoes/btn_acesse_secondary.png' },
      { nome: 'btn_acesse_secondary_inverse', path: 'assets/componentes/botoes/btn_acesse_secondary_inverse.png' },
      { nome: 'btn_acesse_secondary_inverse_small', path: 'assets/componentes/botoes/btn_acesse_secondary_inverse_small.png' },
      { nome: 'btn_acesse_secondary_small', path: 'assets/componentes/botoes/btn_acesse_secondary_small.png' },
      { nome: 'btn_acesse_small', path: 'assets/componentes/botoes/btn_acesse_small.png' },
      { nome: 'btn_app', path: 'assets/componentes/botoes/btn_app.png' },
      { nome: 'btn_app_inverse', path: 'assets/componentes/botoes/btn_app_inverse.png' },
      { nome: 'btn_app_inverse_small', path: 'assets/componentes/botoes/btn_app_inverse_small.png' },
      { nome: 'btn_app_secondary', path: 'assets/componentes/botoes/btn_app_secondary.png' },
      { nome: 'btn_app_secondary_inverse', path: 'assets/componentes/botoes/btn_app_secondary_inverse.png' },
      { nome: 'btn_app_secondary_small', path: 'assets/componentes/botoes/btn_app_secondary_small.png' },
      { nome: 'btn_app_small', path: 'assets/componentes/botoes/btn_app_small.png' },
      { nome: 'btn_assine_inverse', path: 'assets/componentes/botoes/btn_assine_inverse.png' },
      { nome: 'btn_assine_inverse_small', path: 'assets/componentes/botoes/btn_assine_inverse_small.png' },
      { nome: 'btn_assine_secondary', path: 'assets/componentes/botoes/btn_assine_secondary.png' },
      { nome: 'btn_assine_secondary_inverse', path: 'assets/componentes/botoes/btn_assine_secondary_inverse.png' },
      { nome: 'btn_assine_secondary_inverse_small', path: 'assets/componentes/botoes/btn_assine_secondary_inverse_small.png' },
      { nome: 'btn_assine_secondary_small', path: 'assets/componentes/botoes/btn_assine_secondary_small.png' },
      { nome: 'btn_assine_small', path: 'assets/componentes/botoes/btn_assine_small.png' },
      { nome: 'btn_beneficio_inverse', path: 'assets/componentes/botoes/btn_beneficio_inverse.png' },
      { nome: 'btn_beneficio_inverse_small', path: 'assets/componentes/botoes/btn_beneficio_inverse_small.png' },
      { nome: 'btn_beneficio_secondary', path: 'assets/componentes/botoes/btn_beneficio_secondary.png' },
      { nome: 'btn_beneficio_secondary_inverse_small', path: 'assets/componentes/botoes/btn_beneficio_secondary_inverse_small.png' },
      { nome: 'btn_beneficio_secondary_small', path: 'assets/componentes/botoes/btn_beneficio_secondary_small.png' },
      { nome: 'btn_beneficio_small', path: 'assets/componentes/botoes/btn_beneficio_small.png' },
      { nome: 'btn_compreagora_inverse', path: 'assets/componentes/botoes/btn_compreagora_inverse.png' },
      { nome: 'btn_compreagora_inverse_small', path: 'assets/componentes/botoes/btn_compreagora_inverse_small.png' },
      { nome: 'btn_compreagora_secondary', path: 'assets/componentes/botoes/btn_compreagora_secondary.png' },
      { nome: 'btn_compreagora_secondary_inverse', path: 'assets/componentes/botoes/btn_compreagora_secondary_inverse.png' },
      { nome: 'btn_compreagora_secondary_inverse_small', path: 'assets/componentes/botoes/btn_compreagora_secondary_inverse_small.png' },
      { nome: 'btn_compreagora_small', path: 'assets/componentes/botoes/btn_compreagora_small.png' },
      { nome: 'btn_queroesse', path: 'assets/componentes/botoes/btn_queroesse.png' },
      { nome: 'btn_queroesse_inverse', path: 'assets/componentes/botoes/btn_queroesse_inverse.png' },
      { nome: 'btn_queroesse_secondary', path: 'assets/componentes/botoes/btn_queroesse_secondary.png' },
      { nome: 'btn_queroesse_secondary_inverse', path: 'assets/componentes/botoes/btn_queroesse_secondary_inverse.png' },
      { nome: 'btn_queroesse_secondary_inverse_small', path: 'assets/componentes/botoes/btn_queroesse_secondary_inverse_small.png' },
      { nome: 'btn_queroesse_secondary_small', path: 'assets/componentes/botoes/btn_queroesse_secondary_small.png' },
      { nome: 'btn_saibamais', path: 'assets/componentes/botoes/btn_saibamais.png' },
      { nome: 'btn_saibamais_inverse', path: 'assets/componentes/botoes/btn_saibamais_inverse.png' },
      { nome: 'btn_saibamais_inverse_small', path: 'assets/componentes/botoes/btn_saibamais_inverse_small.png' },
      { nome: 'btn_saibamais_secondary', path: 'assets/componentes/botoes/btn_saibamais_secondary.png' },
      { nome: 'btn_saibamais_secondary_inverse', path: 'assets/componentes/botoes/btn_saibamais_secondary_inverse.png' },
      { nome: 'btn_saibamais_secondary_small', path: 'assets/componentes/botoes/btn_saibamais_secondary_small.png' },
      { nome: 'btn_saibamais_small', path: 'assets/componentes/botoes/btn_saibamais_small.png' }
    ];
  }

  //INSERE IMAGENS DOS BOTOES
  insereImagemBotao(path: string) {
    const editableContainer = document.getElementById('editable-container');
    if (editableContainer && this.currentRange) {
      const img = document.createElement('img');
      img.src = path;
      this.saveState(); // Salvar o estado antes de fazer a alteração

      this.currentRange.deleteContents();
      this.currentRange.insertNode(img);
      this.currentRange = null; // Reset the stored range

      this.rawEmailHTML = editableContainer.innerHTML;
      this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
    }
  }

  alinhamentoSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return;
  
    const editableContainer = document.getElementById('email-container');
    if (!editableContainer) return;
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
  
    // Remove qualquer div existente com o atributo de estilo
    const existingDiv = editableContainer.querySelector('div[style]');
    if (existingDiv) {
      existingDiv.outerHTML = existingDiv.innerHTML;
    }
  
    // Cria um elemento <div> para envolver o conteúdo selecionado
    const div = document.createElement('div');
  
    // Define o estilo de acordo com o valor selecionado
    switch (selectedValue) {
      case 'left':
        div.style.textAlign = 'left';
        break;
      case 'center':
        div.style.textAlign = 'center';
        break;
      case 'right':
        div.style.textAlign = 'right';
        break;
      default:
        break;
    }
  
    this.saveState(); // Salvar o estado antes de fazer a alteração
  
    // Move o conteúdo selecionado para dentro do <div> com o estilo de alinhamento
    div.appendChild(range.extractContents());
    range.insertNode(div);
  
    // Atualiza o HTML editável
    this.rawEmailHTML = editableContainer.innerHTML;
    this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
  }
  //---------------- FIM DOS BOTOES  ----------------


  //---------------- INICIO DOS  CARDS ----------------
  carregarOpcoesCards() {
    this.mostrarPropriedades = false;
    this.mostrarTipografia = false;
    this.mostrarHeader = false;
    this.mostrarFooter = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = true; //MOSTRAR Cards
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;

    this.opcoesCards = [];
    const tamanhos = [
      {
        nome: 'Conteudo Branco',
        path: 'assets/componentes/cards/card_conteudo.html',
      },
      {
        nome: 'Conteudo Cinza',
        path: 'assets/componentes/cards/card_conteudo_alternativo.html',
      },
      
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesCards.push({ nome: opcao.nome, html: data });
      });
    });

    
  }
  //---------------- FIM DOS  CARDS ----------------


  //---------------- INICIO DOS  PLANOS ----------------
  carregarOpcoesPlanos() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false;
    this.mostrarFooter = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = true; //MOSTRAR Planos
    this.mostrarVitrine = false;

    this.opcoesVitrinePlanos = [];
    const descricoes = [
      {
        nome: 'Plano 1',
        path: 'assets/componentes/plano/vitrine_plano_opcao1.html',
      },
      {
        nome: 'Plano 2',
        path: 'assets/componentes/plano/vitrine_plano_opcao2.html',
      },
      {
        nome: 'Plano 3',
        path: 'assets/componentes/plano/vitrine_plano_opcao3.html',
      },
      {
        nome: 'Plano 4',
        path: 'assets/componentes/plano/vitrine_plano_opcao4.html',
      },
    ];

    descricoes.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesVitrinePlanos.push({ nome: opcao.nome, html: data });
      });
    });
  }
  //---------------- FIM DAS  PLANOS ----------------


  //---------------- INICIO DAS  PLANOS ----------------
  carregarOpcoesVitrine() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false;
    this.mostrarFooter = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = false;
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = true; //MOSTRAR VITRINE

    this.opcoesVitrineEquipamento = [];
    const tamanhos = [
      {
        nome: 'Equipamento 1',
        path: 'assets/componentes/vitrine/vitrine_equipamento_opcao1.html',
      },
      {
        nome: 'Equipamento 2',
        path: 'assets/componentes/vitrine/vitrine_equipamento_opcao2.html',
      },
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesVitrineEquipamento.push({ nome: opcao.nome, html: data });
      });
    });
  }
  //---------------- FIM DAS VITRINE ----------------


  //---------------- ANEXAR IMAGEM ----------------
  AnexarImagem() {
    this.mostrarPropriedades = false;
    this.mostrarHeader = false; 
    this.mostrarFooter = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = true; //MOSTRAR
    this.mostrarBotao = false;
    this.mostrarCards = false;
    this.mostrarPlanos = false;
    this.mostrarVitrine = false;
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.draggable = true;
        img.ondragstart = (ev: DragEvent) => {
          ev.dataTransfer?.setData('text/plain', img.src);
        };

        // Define o tamanho da imagem com base na seleção do usuário
        switch (this.selectedImageSize) {
          case 'P':
            img.style.width = '25%';
            break;
          case 'M':
            img.style.width = '50%';
            break;
          case 'G':
            img.style.width = '100%';
            break;
          default:
            img.style.width = '50%'; // Caso padrão: médio
            break;
        }
        this.saveState(); // Salvar o estado antes de fazer a alteração
   

        const editableContainer = this.elRef.nativeElement.querySelector('#content-container');
        if (editableContainer) {
          editableContainer.innerHTML = ''; // Limpa o conteúdo existente antes de inserir a imagem
          editableContainer.appendChild(img); // Insere a nova imagem
          this.rawEmailHTML = editableContainer.innerHTML; // Atualiza o HTML editável
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML); // Atualiza o HTML seguro
        }
      };

      reader.readAsDataURL(file);
    }
  }

  uploadFileHeader(event: any) {
    this.uploadFileToContainer('[data-replaceable-image-header]', event);
  }
  
  uploadFileVitrine1(event: any) {
    this.uploadFileToContainer('[data-replaceable-image-vitrine1]', event);
  }
  
  uploadFileVitrine2(event: any) {
    this.uploadFileToContainer('[data-replaceable-image-vitrine2]', event);
  }
  
  uploadFileCard(event: any) {
    this.uploadFileToContainer('[data-replaceable-image-card]', event);
  }
  
  private uploadFileToContainer(selector: string, event: any) {
    this.saveState(); // Salvar o estado antes de fazer a alteração

    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.height = 'auto';
  
        img.draggable = true;
        img.ondragstart = (ev: DragEvent) => {
          ev.dataTransfer?.setData('text/plain', img.src);
        };
  
        // Seleciona o container específico onde a imagem será inserida
        const container = this.elRef.nativeElement.querySelector(selector);
  
        if (container) {
          container.src = img.src; // Atualiza o atributo src do elemento img no container específico
          container.style.width = img.style.width; // Atualiza o estilo width do elemento img no container específico
          container.style.height = img.style.height; // Atualiza o estilo height do elemento img no container específico
          container.style.display = img.style.display; // Atualiza o estilo display do elemento img no container específico
          this.updateEmailHTML(); // Atualiza o HTML editável
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  updateEmailHTML() {
    const headerHTML = this.elRef.nativeElement.querySelector('#header-container')?.innerHTML || '';
    const contentHTML = this.elRef.nativeElement.querySelector('#content-container')?.innerHTML || '';
    const footerHTML = this.elRef.nativeElement.querySelector('#footer-container')?.innerHTML || '';
  
    this.rawEmailHTML = `${headerHTML}${contentHTML}${footerHTML}`;
    this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
  }

  //---------------- FIM ANEXAR IMAGEM FIM ----------------


  //---------------- SALVAR HTML ----------------
  downloadHTML(html: string, filename: string) {
    const imgRegex = /<img.*?src="(.*?)".*?>/g;
    const matches = Array.from(html.matchAll(imgRegex));
    
    const promises = [];
  
    // Função para carregar imagens e converter para base64
    const loadImageToBase64 = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result as string); // Resolve com o conteúdo base64 da imagem
          };
          reader.onerror = reject;
          reader.readAsDataURL(xhr.response); // Lê o conteúdo do blob como Data URL
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob'; // Definir o responseType antes de abrir o request
        xhr.open('GET', src, true); // Abertura do request
        xhr.send(); // Envio do request
      });
    };
  
    // Iterar sobre todas as correspondências de tags <img>
    for (const match of matches) {
      const imgSrc = match[1]; // Captura o atributo src da tag <img>
      promises.push(loadImageToBase64(imgSrc).then((base64) => {
        html = html.replace(imgSrc, base64); // Substituir src da imagem pelo conteúdo base64 no HTML
      }).catch((error) => {
        console.error('Erro ao carregar imagem:', error);
      }));
    }
  
    // Aguardar todas as promessas de carregamento de imagens serem resolvidas
    Promise.all(promises).then(() => {
      // Estilizar o HTML com a cor de fundo selecionada
      const styledHTML = `<html><head><style>body { background-color: ${this.selectedBackgroundColor}; }</style></head><body>${html}</body></html>`;
  
      // Criar o Blob com o HTML estilizado
      const blob = new Blob([styledHTML], { type: 'text/html' });
  
      // Criar um link temporário para o download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
  
      // Adicionar o link ao documento e simular o clique para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch((error) => {
      console.error('Erro ao processar imagens:', error);
    });
  }
  
  removeContentEditable(html: string): string {
    // Cria um elemento DOM temporário para manipulação
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  
    // Remove o atributo contenteditable de todos os elementos
    const elements = tempDiv.querySelectorAll('[contenteditable]');
    elements.forEach(element => {
      element.removeAttribute('contenteditable');
    });
  
    return tempDiv.innerHTML;
  }
  
  saveChanges() {
    const headerContainer = this.elRef.nativeElement.querySelector('#header-container');
    const contentContainer = this.elRef.nativeElement.querySelector('#content-container');
    const footerContainer = this.elRef.nativeElement.querySelector('#footer-container');
  
    if (headerContainer && contentContainer && footerContainer) {
      const headerHTML = headerContainer.outerHTML;
      const contentHTML = contentContainer.outerHTML;
      const footerHTML = footerContainer.outerHTML;
  
      const combinedHTML = `${headerHTML}${contentHTML}${footerHTML}`;
      const cleanedHTML = this.removeContentEditable(combinedHTML);
  
      this.rawEmailHTML = combinedHTML;
      this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(cleanedHTML);
      console.log('HTML atualizado:', cleanedHTML);
  
      this.downloadHTML(cleanedHTML, 'Email.html');
    }
  }
  //---------------- FIM SALVAR HTML ----------------


  //---------------- APLICA MUDANÇA NO HTML ----------------
  AplicaMudanca(event: any, section: 'header' | 'content' | 'footer') {
    const selectedValue = event.target.value;
    let editableContainer: HTMLElement | null = null;
  
    // Seleciona a seção apropriada com base no parâmetro `section`
    switch (section) {
      case 'header':
        editableContainer = document.getElementById('header-container');
        break;
      case 'content':
        editableContainer = document.getElementById('content-container');
        break;
      case 'footer':
        editableContainer = document.getElementById('footer-container');
        break;
    }
  
    if (editableContainer) {
      let selectedOption: { nome: string, html?: string, path?: string } | undefined;
  
      // Verifica em qual array de opções está o valor selecionado
      selectedOption =
        this.opcoesPropriedades.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesTitulos.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesDescricoes.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesLinks.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesBotoes.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesCards.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesPlanos.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesVitrineEquipamento.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesVitrinePlanos.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesFooters.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesPropriedadesEmpresas.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesHeaders.find((opcoes) => opcoes.nome === selectedValue);
  
      if (selectedOption) {
        const div = document.createElement('div');
  
        if (selectedOption.html) {
          div.innerHTML = selectedOption.html;
        } else if (selectedOption.path) {
          const img = document.createElement('img');
          img.src = selectedOption.path;
          div.appendChild(img);
        }
  
        const frag = document.createDocumentFragment();
        let node;
        while ((node = div.firstChild)) {
          frag.appendChild(node);
        }
  
        this.saveState(); // Salvar o estado antes de fazer a alteração
  
        // Adiciona o conteúdo à seção apropriada
        if (section === 'content') {
          editableContainer.appendChild(frag);
          this.rawEmailHTML = editableContainer.innerHTML;
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
        } else {
          // Para header e footer, substitui o conteúdo inteiro
          editableContainer.innerHTML = '';
          editableContainer.appendChild(frag);
        }
      }
    }
  }
  //---------------- APLICA MUDANÇA NO HTML ----------------


  //---------------- DESFAZER MUDANÇA NO HTML ----------------
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.saveState(); // Salvar o estado antes de deletar
    }
  }
  
  saveState() {
    const headerContainer = document.getElementById('header-container');
    const contentContainer = document.getElementById('content-container');
    const footerContainer = document.getElementById('footer-container');
  
    if (headerContainer && contentContainer && footerContainer) {
      const currentState = {
        header: headerContainer.innerHTML,
        content: contentContainer.innerHTML,
        footer: footerContainer.innerHTML,
      };
  
      this.undoStack.push(currentState);
    }
  }
  
  
  desfazer() {
    if (this.undoStack.length > 0) {
      const prevState = this.undoStack.pop();
  
      if (prevState) {
        const headerContainer = document.getElementById('header-container');
        const contentContainer = document.getElementById('content-container');
        const footerContainer = document.getElementById('footer-container');
  
        if (headerContainer && contentContainer && footerContainer) {
          headerContainer.innerHTML = prevState.header;
          contentContainer.innerHTML = prevState.content;
          footerContainer.innerHTML = prevState.footer;
  
          this.atualizarHTML(); // Atualiza o HTML após desfazer
        }
      }
    }
  }
  //---------------- DESFAZER MUDANÇA NO HTML ----------------

}
