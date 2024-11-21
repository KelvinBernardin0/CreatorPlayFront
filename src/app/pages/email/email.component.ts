import {HttpClient} from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DomSanitizer,SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute,Router} from '@angular/router';
import {StringState} from 'src/app/common/types/State';
import {CenteredContentComponent} from './components/centered-content/centered-content.component';
import {ContextMenuComponent} from './components/menu/context-menu/context-menu.component';
import {HoverBorderComponent} from './components/menu/hover-border/hover-border.component';
import {footers} from './data/footers';
import {headers} from './data/headers';
import Command from './patterns/command/command';
import DragCopyEndCommand from './patterns/command/drag/drag-copy-end-command';
import DragCopyStartCommand from './patterns/command/drag/drag-copy-start-command';
import HistoryStringStateStack from './patterns/command/history/history-string-state-stack';
import {EditorMediator} from './patterns/mediator/editor_mediator';
import {PropertyState} from './patterns/state/propertie-state';

interface OpcaoHeader {
  nome: string;
  path: string;
  html?: string;
}
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EmailComponent extends EditorMediator implements AfterViewInit {
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';

  headerHTML: SafeHtml = '';
  contentHTML: SafeHtml = '';
  footerHTML: SafeHtml = '';

  mostrarPropriedades: boolean = false;
  mostrarHeader: boolean = false;
  mostrarFooter: boolean = false;

  opcoesPropriedades: { nome: string; html: string }[] = [];
  opcoesPropriedadesEmpresas: { nome: string; html: string }[] = [];
  opcoesHeaders!: OpcaoHeader[];
  opcoesFooters: { nome: string; html: string }[] = [];

  selectedBackgroundColor = ''; // Cor de fundo selecionada

  @ViewChild(CenteredContentComponent)
  centeredContentComponent!: CenteredContentComponent;

  @ViewChild(HoverBorderComponent)
  hoverBorderComponent!: HoverBorderComponent;

  @ViewChild(ContextMenuComponent)
  contextMenuComponent!: ContextMenuComponent;

  protected propertyState: PropertyState = 'Vazio';
  protected historyStack = new HistoryStringStateStack(this);
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private http: HttpClient,
    private elRef: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {
    super()
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['emailHTML']) {
        this.rawEmailHTML = params['emailHTML'];
        this.divideHTML(this.rawEmailHTML);
      }
    });
    this.changeDetector.detectChanges()
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

    this.opcoesFooters = [];

    footers.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesFooters.push({ nome: opcao.nome, html: data });
      });
    });
  }
  //---------------- FIM CARREGAR FOOTERS ----------------

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

  uploadFileHeader(event: any) {
    this.uploadFileToContainer('[data-replaceable-image-header]', event);
  }

  private uploadFileToContainer(selector: string, event: any) {
    this.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

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
          // this.updateEmailHTML(); // Atualiza o HTML editável
        }
      };

      reader.readAsDataURL(file);
    }
  }

  updateEmailHTML() {
    const headerHTML =
      this.elRef.nativeElement.querySelector('#header-container')?.innerHTML ||
      '';
    const contentHTML =
      this.elRef.nativeElement.querySelector('#content-container')?.innerHTML ||
      '';
    const footerHTML =
      this.elRef.nativeElement.querySelector('#footer-container')?.innerHTML ||
      '';

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
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
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
      promises.push(
        loadImageToBase64(imgSrc)
          .then((base64) => {
            html = html.replace(imgSrc, base64); // Substituir src da imagem pelo conteúdo base64 no HTML
          })
          .catch((error) => {
            console.error('Erro ao carregar imagem:', error);
          })
      );
    }

    // Aguardar todas as promessas de carregamento de imagens serem resolvidas
    Promise.all(promises)
      .then(() => {
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
      })
      .catch((error) => {
        console.error('Erro ao processar imagens:', error);
      });
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

  override saveChanges() {
    const headerContainer =
      this.elRef.nativeElement.querySelector('#header-container');
    const contentContainer =
      this.elRef.nativeElement.querySelector('#content-container');
    const footerContainer =
      this.elRef.nativeElement.querySelector('#footer-container');

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
      let selectedOption:
        | { nome: string; html?: string; path?: string }
        | undefined;

      // Verifica em qual array de opções está o valor selecionado
      selectedOption =
        this.opcoesPropriedades.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesFooters.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesPropriedadesEmpresas.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
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

        this.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

        // Adiciona o conteúdo à seção apropriada
        if (section === 'content') {
          editableContainer.appendChild(frag);
          this.rawEmailHTML = editableContainer.innerHTML;
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
            this.rawEmailHTML
          );
        } else {
          // Para header e footer, substitui o conteúdo inteiro
          editableContainer.innerHTML = '';
          editableContainer.appendChild(frag);
        }
      }
    }
  }
  //---------------- APLICA MUDANÇA NO HTML ----------------

  dragCopyEnd(event: DragEvent) {
    const command = new DragCopyEndCommand(this, event);
    this.executeCommand(command);
  }
  dragCopyStart(event: DragEvent, data: string) {
    const command = new DragCopyStartCommand(this, event, data);
    this.executeCommand(command);
  }

  override saveNewEditorState(stringState: StringState): void {
    this.historyStack.save(stringState);
  }

  override updateEditorState(state: StringState): void {
    this.centeredContentComponent.atualizarHTML(state);
  }

  override updateHoverbleElements(): void {
    this.centeredContentComponent.updateHoverbleElements();
  }
  override undoEditorState(): void {
    this.historyStack.undo();
    this.hideContextMenu()
  }
  override getSelectedElement(): Element|null {
    return this.contextMenuComponent.innerElement
  }
  override hideContextMenu(): void {
    this.contextMenuComponent.hide();
  }

  override displayContextMenuOn(element: Element): void {
    this.contextMenuComponent.displayComponentOn(element);
  }

  override saveCurrentEditorState(): void {
    this.centeredContentComponent.saveState();
  }

  override getCurrentEditorState(): StringState | null{
    return this.historyStack.getLastState();
  }

  override displayHoverBorderOn(element: Element): void {
    this.hoverBorderComponent.displayComponentOn(element);
  }
  override hideHoverBorder(): void {
    this.hoverBorderComponent.hide();
  }

  override changePropertiesState(state: PropertyState): void {
    this.propertyState = state;
  }

  override executeCommand(command: Command): void {
    command.execute();
  }
}
