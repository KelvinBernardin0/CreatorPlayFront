import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';
  mostrarTipografia: boolean = false;
  mostrarImagem: boolean = false;
  mostrarPropriedades: boolean = true;
  opcoesTitulos: { nome: string, html: string }[] = [];
  opcoesDescricoes: { nome: string, html: string }[] = [];
  opcoesLinks: { nome: string, html: string }[] = [];
  currentRange: Range | null = null;  // To store the current cursor position

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router, private http: HttpClient, private elRef: ElementRef) {
    this.route.queryParams.subscribe(params => {
      if (params['emailHTML']) {
        this.rawEmailHTML = params['emailHTML'];
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
      }
    });
  }

  redirecionarParaEmailSemImagem() {
    this.carregarEmail('assets/componentes/headers/header_sem_imagem.html');
  }

  redirecionarParaEmailComImagem() {
    this.carregarEmail('assets/componentes/headers/header_com_imagem.html');
  }

  carregarEmail(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      this.emailHTML = data;
      this.router.navigate(['/email'], { queryParams: { emailHTML: this.emailHTML } });
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

  saveChanges() {
    const editableContainer = this.elRef.nativeElement.querySelector('#editable-container');
    if (editableContainer) {
      this.rawEmailHTML = editableContainer.innerHTML;
      this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
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

  carregarOpcoesTipografias() {
    this.opcoesTitulos = [];
    const tamanhos = [
      { nome: 'H1 Branco', path: 'assets/componentes/tipografia/H1_Branco.html' },
      { nome: 'H2 Branco', path: 'assets/componentes/tipografia/H2_Branco.html' },
      { nome: 'H3 Branco', path: 'assets/componentes/tipografia/H3_Branco.html' },
      { nome: 'H1 Roxo', path: 'assets/componentes/tipografia/H1_Roxo.html' },
      { nome: 'H2 Roxo', path: 'assets/componentes/tipografia/H2_Roxo.html' },
      { nome: 'H3 Roxo', path: 'assets/componentes/tipografia/H3_Roxo.html' }
    ];
  
    tamanhos.forEach(opcao => { // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe(data => {
        this.opcoesTitulos.push({ nome: opcao.nome, html: data });
      });
    });

    this.opcoesDescricoes = [];
    const descricoes = [
      { nome: 'Descrição Cinza 16px', path: 'assets/componentes/tipografia/DescricaoCinza_FonteSize16px.html' },
      { nome: 'Descrição Cinza 14px', path: 'assets/componentes/tipografia/DescricaoCinza_FonteSize14px.html' },
      { nome: 'Descrição Branca 16px', path: 'assets/componentes/tipografia/DescricaoBranca_FonteSize16px.html' },
      { nome: 'Descrição Branca 14px', path: 'assets/componentes/tipografia/DescricaoBranca_FonteSize14px.html' }
    ];
  
    descricoes.forEach(opcao => { // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe(data => {
        this.opcoesDescricoes.push({ nome: opcao.nome, html: data });
      });
    });

    
    this.opcoesLinks = [];
    const links = [
      { nome: 'Link Sublinhado Roxo 16px', path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize16px.html' },
      { nome: 'Link Sublinhado Roxo 12px', path: 'assets/componentes/tipografia/LinkSublinhado_Roxo_FonteSize12px.html' },
      { nome: 'Link Sublinhado Branco 16px', path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize16px.html' },
      { nome: 'Link Sublinhado Branco 12px', path: 'assets/componentes/tipografia/LinkSublinhado_Branco_FonteSize12px.html' },
      { nome: 'Link S/ Sublinhado Roxo 16px', path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize16px.html' },
      { nome: 'Link S/ Sublinhado Roxo 12px', path: 'assets/componentes/tipografia/LinkSemSublinhado_Roxo_FonteSize12px.html' },
      { nome: 'Link S/ Sublinhado Branco 16px', path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize16px.html' },
      { nome: 'Link S/ Sublinhado Branco 12px', path: 'assets/componentes/tipografia/LinkSemSublinhado_Branco_FonteSize12px.html' },
    ];
  
    links.forEach(opcao => { // Renomeando a variável para evitar colisão
      this.http.get(opcao.path, { responseType: 'text' }).subscribe(data => {
        this.opcoesLinks.push({ nome: opcao.nome, html: data });
      });
    });
    this.mostrarTipografia = true; // Move this line outside the forEach loop
    this.mostrarImagem = false;
    this.mostrarPropriedades = false; // Hide properties when loading typography options
  }

  AnexarImagem() {

    this.mostrarTipografia = false; // Move this line outside the forEach loop
    this.mostrarImagem = true;
    this.mostrarPropriedades = false; // Hide properties when loading typography options
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

      const editableContainer = this.elRef.nativeElement.querySelector('#editable-container');
      if (editableContainer) {
        editableContainer.appendChild(img);
        this.rawEmailHTML = editableContainer.innerHTML;
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
      }
    };
    reader.readAsDataURL(file);
  }

  

  AplicaMudanca(event: any) {
    const selectedValue = event.target.value;
    const editableContainer = document.getElementById('editable-container');
    if (editableContainer) {
      const div = document.createElement('div');
      let selectedOption;

      selectedOption = this.opcoesTitulos.find(opcoes => opcoes.nome === selectedValue)
          || this.opcoesDescricoes.find(opcoes => opcoes.nome === selectedValue)
          || this.opcoesLinks.find(opcoes => opcoes.nome === selectedValue);

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
        this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
        this.mostrarTipografia = true; // Hide typography options after applying
        this.mostrarImagem = false; // Hide typography options after applying
        this.mostrarPropriedades = false;  // Show properties again after applying
      }
    }
  }


  
  

  
  
}
