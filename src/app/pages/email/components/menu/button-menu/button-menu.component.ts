import {HttpClient} from '@angular/common/http';
import {AfterViewInit,Component,Input} from '@angular/core';
import {botoes} from '../../../data/botoes';
import DragButtonStartCommand from '../../../patterns/command/drag/drag-button-start-command';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.css'],
})
export class ButtonMenuComponent extends PropertiesMenu implements AfterViewInit{



  @Input() override mediator!: EditorMediator;

  protected opcoesBotoes: Array<{ nome: string; path: string }> = [];

  constructor(http: HttpClient) {
    super(http);
  }

  ngAfterViewInit(): void {
    this.opcoesBotoes = botoes;
  }

  alinhamentoSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return;

    const editableContainer = document.getElementById('email-container');
    if (!editableContainer) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = this.mediator.getSelectedElement();
    if (!range) return;

    // Remove qualquer div existente com o atributo de estilo
    // const existingDiv = editableContainer.querySelector('div[style]');
    // if (existingDiv) {
    //   existingDiv.outerHTML = existingDiv.innerHTML;
    // }

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

    div.appendChild(range.cloneNode(true));
    range.replaceWith(div);
    this.mediator.displayContextMenuOn(div.firstChild as Element);
    this.mediator.saveCurrentEditorState();
    // range.insertNode(div);

    // Atualiza o HTML editável
    // this.rawEmailHTML = editableContainer.innerHTML;
    // this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
  }

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

      selectedOption = this.opcoesBotoes.find((op) => op.nome === selectedValue)
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
          // this.rawEmailHTML = editableContainer.innerHTML;
          // this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
        } else {
          // Para header e footer, substitui o conteúdo inteiro
          editableContainer.innerHTML = '';
          editableContainer.appendChild(frag);
        }
      }
    }
  }

  dragStart(event: DragEvent, path: string): void {
    const img = document.createElement('img');
    img.src = path;
    img.setAttribute('draggable', 'true')
    const data = img.outerHTML;
    const command = new DragButtonStartCommand(this.mediator,event,data);
    this.mediator.executeCommand(command);
  }

  dragEnd(event: DragEvent){
    const command = new DragCopyEndCommand(this.mediator, event);
    this.mediator.executeCommand(command)
  }
}
