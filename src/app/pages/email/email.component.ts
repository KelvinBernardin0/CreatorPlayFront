import { Component, ElementRef } from '@angular/core';
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
  opcoesHeaders!: OpcaoHeader[];
  opcoesFooters: { nome: string; html: string }[] = [];
  opcoesTitulos: { nome: string; html: string }[] = [];
  opcoesDescricoes: { nome: string; html: string }[] = [];
  opcoesLinks: { nome: string; html: string }[] = [];
  opcoesBotoes: { nome: string; html: string }[] = [];
  opcoesCards: { nome: string; html: string }[] = [];
  opcoesPlanos: { nome: string; html: string }[] = [];
  opcoesVitrineEquipamento: { nome: string; html: string }[] = [];
  opcoesVitrinePlanos: { nome: string; html: string }[] = [];
  currentRange: Range | null = null; // To store the current cursor position

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
    });
  }

  carregarEmail(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe((data) => {
      this.emailHTML = data;
      this.router.navigate(['/email'], {
        queryParams: { emailHTML: this.emailHTML },
      });
    });
  }

  makeEditable(event: any) {
    const target = event.target;
    if (target && target.nodeType === 1) {
      target.setAttribute('contenteditable', 'true');
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.currentRange = selection.getRangeAt(0);
    }
  }


  // CARREGAR HERADES
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

  opcaoSelecionada(event: any) {
    debugger;
    const selectedPath = event.target.value;
    this.carregarEmail(selectedPath);
  }
  // FIM CARREGAR HERADES


  // CARREGAR FOOTERS
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
  // FIM CARREGAR FOOTERS


  // CARREGAR TEXTOS
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
  // FIM CARREGAR TEXTOS


  // CARREGAR BOTOES
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

    this.opcoesBotoes = [];
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
        this.opcoesBotoes.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesBotoes = [];
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
        this.opcoesBotoes.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesBotoes = [];
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
        this.opcoesBotoes.push({ nome: opcao.nome, html: data });
      });
    });
  }
  // PROPRIEDADES BOTOES FIM


  // INICIO DAS PROPRIEDADES CARDS
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
  // FIM DAS PROPRIEDADES CARDS


  // INICIO DAS PROPRIEDADES PLANOS
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
  // FIM DAS PROPRIEDADES PLANOS


  // INICIO DAS PROPRIEDADES PLANOS
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
  // FIM DAS PROPRIEDADES VITRINE


  // ANEXAR IMAGEM
  AnexarImagem() {
    this.mostrarPropriedades = false;
    this.mostrarTipografia = false;
    this.mostrarImagem = true; //MOSTRAR IMAGEM
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
      img.style.maxWidth = '100%';
      img.draggable = true;
      img.ondragstart = (ev: DragEvent) => {
        ev.dataTransfer?.setData('text/plain', img.src);
      };

      const editableContainer = this.elRef.nativeElement.querySelector(
        '#editable-container'
      );
      if (editableContainer) {
        editableContainer.appendChild(img);
        this.rawEmailHTML = editableContainer.innerHTML;
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
          this.rawEmailHTML
        );
      }
    };
    reader.readAsDataURL(file);
  }
  // ANEXAR IMAGEM FIM


  // SALVAR HTML
  saveChanges() {
    const editableContainer = this.elRef.nativeElement.querySelector(
      '#editable-container'
    );
    if (editableContainer) {
      this.rawEmailHTML = editableContainer.innerHTML;
      this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
        this.rawEmailHTML
      );
      console.log('HTML atualizado:', this.rawEmailHTML);
      this.downloadHTML(this.rawEmailHTML, 'Email.html');
    }
  }

  downloadHTML(html: string, filename: string) {
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // SALVAR HTML


  // APLICA MUDANCAN NO HTML
  AplicaMudanca(event: any) {
    const selectedValue = event.target.value;
    const editableContainer = document.getElementById('editable-container');
    if (editableContainer) {
      const div = document.createElement('div');
      let selectedOption;

      // Verifica em qual array de opções está o valor selecionado
      selectedOption =
        this.opcoesPropriedades.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesTitulos.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesDescricoes.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesLinks.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesBotoes.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesCards.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesPlanos.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesVitrineEquipamento.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesVitrinePlanos.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesFooters.find((opcoes) => opcoes.nome === selectedValue);

      if (selectedOption) {
        div.innerHTML = selectedOption.html;
        const frag = document.createDocumentFragment();
        let node;
        while ((node = div.firstChild)) {
          frag.appendChild(node);
        }

        if (this.currentRange) {
          this.currentRange.deleteContents();
          this.currentRange.insertNode(frag);
          this.currentRange = null; // Reset the stored range
        } else {
          editableContainer.appendChild(frag); // Append to the end if no range is stored
        }

        this.rawEmailHTML = editableContainer.innerHTML;
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
          this.rawEmailHTML
        );
      }
    }
  }
  // APLICA MUDANCAN NO HTML


}
