import { AfterViewInit, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StringState } from 'src/app/common/types/State';
import { EditorMediator } from '../../patterns/mediator/editor_mediator';

@Component({
  selector: 'app-centered-content',
  templateUrl: './centered-content.component.html',
  styleUrls: ['./centered-content.component.css'],
})
export class CenteredContentComponent implements AfterViewInit {
  @Input() selectedBackgroundColor = '';

  @Input() headerHTML: SafeHtml = '';
  @Input() contentHTML: SafeHtml = '';
  @Input() footerHTML: SafeHtml = '';
  @Input() editorMediator!: EditorMediator;

  currentRange: Range | null = null; //Para armazenar a posição atual do cursor

  lastUploadedImg: HTMLImageElement | null = null; // Para armazenar a última imagem carregada
  elementoClicado!: HTMLElement;
  textoEditado!: string;

  constructor(private sanitizer: DomSanitizer) {}
  ngAfterViewInit(): void {
    this.updateHoverbleElements();
  }

  public updateHoverbleElements() {
    const centerElements = document.querySelectorAll('#content-container *');
    centerElements.forEach((element: Element) => {
      const isHtmlElement = element.nodeType === 1;
      const moveableComponents = [
        'APP-CONTEXT-MENU',
        'APP-HOVER-BORDER',
      ].includes(element.tagName);
      if (isHtmlElement && !moveableComponents) {
        this.addHoverEventsOn(element);
        element.setAttribute('draggable', 'false');
      }
    });
  }

  private addHoverEventsOn(element: Element): void {
    element.removeEventListener('mouseenter', () =>
      this.editorMediator.displayHoverBorderOn(element)
    );
    element.removeEventListener('mouseleave', () =>
      this.editorMediator.hideHoverBorder()
    );
    element.addEventListener('mouseenter', () =>
      this.editorMediator.displayHoverBorderOn(element)
    );
    element.addEventListener('mouseleave', () =>
      this.editorMediator.hideHoverBorder()
    );
  }

  makeEditable(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.nodeType === 1) {
      target.setAttribute('contenteditable', 'true');
      this.editorMediator.displayContextMenuOn(target);
    } else {
      this.editorMediator.hideContextMenu();
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.currentRange = selection.getRangeAt(0);
    }

    // Limpe a última imagem carregada ao tornar o conteúdo editável novamente
    this.lastUploadedImg = null;
  }

  public saveState(): void {
    this.executeOnContents((header, content, footer) => {
      this.editorMediator.saveNewEditorState({
        header: header,
        content: content,
        footer: footer,
      });
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Control') return;

    const deleteEvent = event.key === 'Delete' || event.key === 'Backspace';
    if (deleteEvent) {
      this.saveState(); // Salvar o estado antes de deletar
      return;
    }
    const undoEvent =
      (event.metaKey || event.ctrlKey) &&
      (event.key === 'z' || event.key === 'Z');
    if (undoEvent) {
      event.preventDefault();
      this.editorMediator.undoEditorState();
      this.editorMediator.hideContextMenu();
      return;
    }

    this.saveState();
  }

  public atualizarHTML(state: StringState): void {
    this.executeOnContents(() => {
      this.headerHTML = this.sanitizer.bypassSecurityTrustHtml(state.header);
      this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(state.content);
      this.footerHTML = this.sanitizer.bypassSecurityTrustHtml(state.footer);
    });
  }

  private executeOnContents(
    task: (header: string, content: string, footer: string) => void
  ): void {
    const headerContainer = document.getElementById('header-container');
    const contentContainer = document.getElementById('content-container');
    const footerContainer = document.getElementById('footer-container');

    if (headerContainer && contentContainer && footerContainer)
      task(
        headerContainer.innerHTML,
        contentContainer.innerHTML,
        footerContainer.innerHTML
      );
  }

  public changeBackgroundColor(color: string) {
    this.selectedBackgroundColor = color;
  }

  public getCurrentEditorState(): StringState {
    const headerContainer = document.getElementById('header-container');
    const contentContainer = document.getElementById('content-container');
    const footerContainer = document.getElementById('footer-container');

    if (!headerContainer || !contentContainer || !footerContainer)
      throw new Error(`Conteúdo incompleto no editor`);

    return {
      header: headerContainer.innerHTML,
      content: contentContainer.innerHTML,
      footer: footerContainer.innerHTML,
    };
  }

  selecionarBlocoTexto(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Busca o elemento mais próximo com a classe 'bloco-texto', incluindo os filhos
    const blocoTexto = target.closest('.bloco-texto') as HTMLElement;  // Casting para HTMLElement
  
    if (blocoTexto) {
      this.elementoClicado = blocoTexto; // Armazena o elemento clicado
      this.textoEditado = blocoTexto.innerHTML; // Captura o texto atual do bloco
      this.editorMediator.openTextEditor(this.textoEditado); // Chama o método no editor para abrir o texto no editor
    }
  }
  
  

  // Método para aplicar o texto modificado ao conteúdo
  aplicarTextoEditado() {
    if (this.elementoClicado) {
      // Modifica apenas o conteúdo do elemento que está sendo editado
      this.elementoClicado.innerHTML = this.textoEditado; // Aplica o texto editado ao conteúdo do elemento
      console.log('Texto aplicado ao conteúdo:', this.textoEditado);
    }
  }
}
