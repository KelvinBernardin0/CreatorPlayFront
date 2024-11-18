import {HttpClient} from '@angular/common/http';
import {AfterViewInit,Component,ElementRef,Renderer2,ViewChild,ViewEncapsulation} from '@angular/core';
import {DomSanitizer,SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute,Router} from '@angular/router';
import {CenteredContentComponent} from './components/centered-content/centered-content.component';
import {botoes} from './data/botoes';
import {cards} from './data/cards';
import {descricoes} from './data/descricoes';
import {equipamentos} from './data/equipamentos';
import {footers} from './data/footers';
import {headers} from './data/headers';
import {links} from './data/links';
import {planos} from './data/planos';
import {propriedades} from './data/propriedades';
import {titulos} from './data/titulos';
import {EmailEditorMediator} from './mediator/email-editor-mediator';
import {EditorMediator} from './mediator/editor_mediator';
import {HoverBorderComponent} from './components/hover-border/hover-border.component';
import {ContextMenuComponent} from './components/context-menu/context-menu.component';

interface OpcaoHeader {
  nome: string;
  path: string;
  html?: string;
}
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailComponent implements AfterViewInit{
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';

  headerHTML: SafeHtml = '';
  contentHTML: SafeHtml = '';
  footerHTML: SafeHtml = '';

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

  @ViewChild(CenteredContentComponent) centeredContentComponent!: CenteredContentComponent;
  @ViewChild(HoverBorderComponent) hoverBorderComponent!: HoverBorderComponent;
  @ViewChild(ContextMenuComponent) contextMenuComponent!: ContextMenuComponent;

  protected mediator!: EditorMediator
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private http: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {

  }


  ngAfterViewInit(): void {
    this.mediator = new EmailEditorMediator(this.renderer, this.centeredContentComponent, this.contextMenuComponent, this.hoverBorderComponent)
    this.route.queryParams
    .subscribe((params) => {
      if (params['emailHTML']) {
        this.rawEmailHTML = params['emailHTML'];
        this.divideHTML(this.rawEmailHTML);
      }
    })
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

    headers.forEach((opcao) => {
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


    footers.forEach((opcao) => {
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

    propriedades.forEach((opcao) => {
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

    titulos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesTitulos.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesDescricoes = [];

    descricoes.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesDescricoes.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesLinks = [];
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
      const range = selection.getRangeAt(0);
      const selectedContents = range.extractContents();
      const span = document.createElement('span');
      span.style.color = cor;

      span.appendChild(selectedContents);
      range.insertNode(span);

      this.mediator.saveCurrentEditorState()
    }
  }

  // Aplica o estilo selecionado ao texto selecionado
  aplicaEstiloSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return; // Retorna se nenhum valor estiver selecionado

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return; // Retorna se não houver seleção

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
    this.mediator.saveCurrentEditorState()
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

          this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

          // Substituir a imagem original pelo link com a imagem clonada
          imgElement.parentNode?.replaceChild(aElement, imgElement);

          // Atualizar o HTML
          // this.atualizarHTML();
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

    this.opcoesBotoes = botoes;
  }

  //INSERE IMAGENS DOS BOTOES
  insereImagemBotao(path: string) {
    const editableContainer = document.getElementById('editable-container');
    if (editableContainer && this.currentRange) {
      const img = document.createElement('img');
      img.src = path;
      this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

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

    this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

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

    cards.forEach((opcao) => {
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

    planos.forEach((opcao) => {
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

    equipamentos.forEach((opcao) => {
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
        this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração


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
    this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

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

        this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

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

}
