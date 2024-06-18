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

  undoStack: string[] = []; // Pilha de históricos para refazer as alterações


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

  selectedImageSize: string = 'M'; //Tamanho padrão da imagem
  lastUploadedImg: HTMLImageElement | null = null; // Para armazenar a última imagem carregada
  termosDeUsoAceitos: boolean = false;

  @ViewChild('editableContainer') editableContainerRef!: ElementRef;


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
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
          this.rawEmailHTML
        );
      }

      this.saveState(); // Salvar o estado antes de fazer a alteração

    });
  }

  saveState() {
    const editableContainer = document.getElementById('editable-container');
    if (editableContainer) {
      this.undoStack.push(editableContainer.innerHTML);
    }
  }

  refazer() {
    if (this.undoStack.length > 0) {
      const editableContainer = document.getElementById('editable-container');
      if (editableContainer) {
        const lastState = this.undoStack.pop();
        if (lastState) {
          editableContainer.innerHTML = lastState;
          this.rawEmailHTML = editableContainer.innerHTML;
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
        }
      }
    }
  }

  //CARREGAR PROPRIEDADES INICIAIS DO EMAIL HTML
  carregarEmail(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe((data) => {
      this.emailHTML = data;
      this.router.navigate(['/email'], {
        queryParams: { emailHTML: this.emailHTML },
      });
    });
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
  

  //---------------- CARREGAR HERADES ----------------
  /**
   * Função para carregar as opções de headers
   */
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

  /**
   * Função chamada quando uma opção é selecionada
   * @param event - Evento de mudança no select
   */
  opcaoSelecionada(event: any) {
    debugger;
    const selectedPath = event.target.value;
    this.carregarEmail(selectedPath);
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
    const editableContainer = document.getElementById('editable-container');


    if (editableContainer) {
      switch (selectedValue) {
        case 'branco':
          editableContainer.style.backgroundColor = '#FFFFFF';
          break;
        case 'cinza':
          editableContainer.style.backgroundColor = '#666666';
          break;
        case 'roxo':
          editableContainer.style.backgroundColor = '#49066B'; 
          break;
        default:
          editableContainer.style.backgroundColor = 'transparent';
          break;
      }


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
        nome: 'Link Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'Link Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'Link Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'Link Sublinhado Branco 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize12px.html',
      },
      {
        nome: 'Link S/ Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'Link S/ Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'Link S/ Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'Link S/ Sublinhado Branco 12px',
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
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = cor;

      this.saveState(); // Salvar o estado antes de fazer a alteração

      range.surroundContents(span);

      // Atualiza o HTML após aplicar a cor
      this.atualizarHTML();
    }
  }

  // Atualiza o HTML após as alterações
  atualizarHTML() {
    const editableContainer = this.editableContainerRef.nativeElement;
    this.rawEmailHTML = editableContainer.innerHTML;
    
    this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
    
  }

  aplicaEstiloSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return; // Sai se nenhum valor estiver selecionado
  
    const editableContainer = document.getElementById('editable-container');
    if (!editableContainer) return;
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
  
    const span = document.createElement('span');
    switch (selectedValue) {
      case 'bold':
        span.style.fontWeight = range.toString().includes('<b>') ? 'normal' : 'bold';
        break;
      case 'italic':
        span.style.fontStyle = range.toString().includes('<i>') ? 'normal' : 'italic';
        break;
      case 'underline':
        span.style.textDecoration = range.toString().includes('<u>') ? 'none' : 'underline';
        break;
      default:
        break;
    }

    this.saveState(); // Salvar o estado antes de fazer a alteração

    range.surroundContents(span);

    this.rawEmailHTML = editableContainer.innerHTML;
    this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
  }

  // INSERIR LINK
  inserirLink() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer as HTMLElement;

      const imgElement = container.querySelector('img');
      if (imgElement) {
        const link = prompt('Digite o URL do link:');
        if (link) {
          const aElement = document.createElement('a');
          aElement.href = link;
          aElement.target = '_blank';
          
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
      { nome: 'botao1', path: 'assets/componentes/botoes/botao1.png' },
      { nome: 'botao2', path: 'assets/componentes/botoes/botao2.png' },
      { nome: 'botao3', path: 'assets/componentes/botoes/botao3.png' },
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
        nome: 'Card de Conteudo Branco',
        path: 'assets/componentes/cards/card_conteudo.html',
      },
      {
        nome: 'Card de Conteudo Cinza',
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

    this.opcoesPlanos = [];
    const tamanhos = [
      {
        nome: 'H1 Branco',
        path: 'assets/componentes/tipografia/H1_Branco.html',
      },
      {
        nome: 'H2 Branco',
        path: 'assets/componentes/tipografia/H2_Branco.html',
      },
      {
        nome: 'H3 Branco',
        path: 'assets/componentes/tipografia/H3_Branco.html',
      },
      { nome: 'H1 Roxo', path: 'assets/componentes/tipografia/H1_Roxo.html' },
      { nome: 'H2 Roxo', path: 'assets/componentes/tipografia/H2_Roxo.html' },
      { nome: 'H3 Roxo', path: 'assets/componentes/tipografia/H3_Roxo.html' },
    ];

    tamanhos.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesPlanos.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesPlanos = [];
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
        this.opcoesPlanos.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesPlanos = [];
    const links = [
      {
        nome: 'Link Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'Link Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'Link Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'Link Sublinhado Branco 12px',
        path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize12px.html',
      },
      {
        nome: 'Link S/ Sublinhado Roxo 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize16px.html',
      },
      {
        nome: 'Link S/ Sublinhado Roxo 12px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize12px.html',
      },
      {
        nome: 'Link S/ Sublinhado Branco 16px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize16px.html',
      },
      {
        nome: 'Link S/ Sublinhado Branco 12px',
        path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize12px.html',
      },
    ];

    links.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesPlanos.push({ nome: opcao.nome, html: data });
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

    this.opcoesVitrinePlanos = [];
    const descricoes = [
      {
        nome: 'Vitrine Plano 1',
        path: 'assets/componentes/vitrine/vitrine_plano_opcao1.html',
      },
      {
        nome: 'Vitrine Plano 2',
        path: 'assets/componentes/vitrine/vitrine_plano_opcao2.html',
      },
      {
        nome: 'Vitrine Plano 3',
        path: 'assets/componentes/vitrine/vitrine_plano_opcao3.html',
      },
      {
        nome: 'Vitrine Plano 4',
        path: 'assets/componentes/vitrine/vitrine_plano_opcao4.html',
      },
    ];

    descricoes.forEach((opcao) => {
      // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
        this.opcoesVitrinePlanos.push({ nome: opcao.nome, html: data });
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

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.height = 'auto';
      // img.style.width = 'auto';
  
      //Define a largura com base no tamanho selecionado
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
      }
  
      img.draggable = true;
      img.ondragstart = (ev: DragEvent) => {
        ev.dataTransfer?.setData('text/plain', img.src);
      };
  
      const editableContainer = this.elRef.nativeElement.querySelector(
        '#editable-container'
      );
      if (editableContainer) {
        const selection = window.getSelection();
        if (selection) {
          if (this.currentRange) {
            //Remove o conteúdo existente no intervalo
            this.currentRange.deleteContents();
  
            this.saveState(); // Salvar o estado antes de fazer a alteração

            //Insere a imagem no intervalo
            this.currentRange.insertNode(img);
  
            // Move o cursor para o final do conteúdo recém-inserido
            const range = document.createRange();
            range.setStartAfter(img);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // Acrescenta a imagem no final se nenhum intervalo for armazenado
            editableContainer.appendChild(img);
          }
  
          //Salva o conteúdo HTML atualizado
          this.rawEmailHTML = editableContainer.innerHTML;
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
            this.rawEmailHTML
          );
        }
      }
    };
    reader.readAsDataURL(file);
  }
  //---------------- FIM ANEXAR IMAGEM FIM ----------------


  //---------------- SALVAR HTML ----------------
  saveChanges() {
    const editableContainer = this.elRef.nativeElement.querySelector('#editable-container');
    if (editableContainer) {
      this.rawEmailHTML = editableContainer.innerHTML;
      const cleanedHTML = this.removeContentEditable(this.rawEmailHTML);
      this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(cleanedHTML);
      console.log('HTML atualizado:', cleanedHTML);
      this.downloadHTML(cleanedHTML, 'Email.html');
    }
  }

  downloadHTML(html: string, filename: string) {
    // Regex para encontrar todas as tags <img> no HTML
    const imgRegex = /<img.*?src="(.*?)".*?>/g;
    const matches = html.matchAll(imgRegex);

    // Array para armazenar as Promises de carregamento de base64 das imagens
    const promises = [];

    // Iterar sobre todas as correspondências de tags <img>
    for (const match of matches) {
      const imgSrc = match[1]; // Captura o atributo src da tag <img>

      // Função para carregar imagem e converter para base64
      const loadImageToBase64 = (src: string) => {
        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
              resolve(reader.result as string); // Resolve com o conteúdo base64 da imagem
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
          };
          xhr.onerror = reject;
          xhr.open('GET', src);
          xhr.responseType = 'blob';
          xhr.send();
        });
      };

      // Adicionar promessa de carregamento de base64 ao array
      promises.push(loadImageToBase64(imgSrc).then((base64) => {
        // Substituir src da imagem pelo conteúdo base64 no HTML
        html = html.replace(imgSrc, base64.toString());
      }).catch((error) => {
        console.error('Erro ao carregar imagem:', error);
      }));
    }

    // Após todas as promessas de carregamento de base64 serem resolvidas
    Promise.all(promises).then(() => {
      // Agora podemos prosseguir com o download do HTML modificado
      const blob = new Blob([html], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
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
  //---------------- FIM SALVAR HTML ----------------


  //---------------- APLICA MUDANÇA NO HTML ----------------
  AplicaMudanca(event: any) {
    const selectedValue = event.target.value;
    const editableContainer = document.getElementById('editable-container');
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
        this.opcoesPropriedadesEmpresas.find((opcoes) => opcoes.nome === selectedValue);

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


        if (this.currentRange) {
          this.currentRange.deleteContents();
          this.currentRange.insertNode(frag);
          this.currentRange = null; // Reset the stored range
        } else {
          editableContainer.appendChild(frag); // Append to the end if no range is stored
        }

        this.rawEmailHTML = editableContainer.innerHTML;
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
      

      
      } 
    }
  }
  //---------------- APLICA MUDANÇA NO HTML ----------------


  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.saveState(); // Salvar o estado antes de deletar
    }
  }

}
