import { AfterViewInit, Component, Input } from '@angular/core';
import PropertiesMenu from '../../abstract/properties-menu';
import { HttpClient } from '@angular/common/http';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { botoes } from '../../../data/botoes';
import { NamedPath } from 'src/app/common/types/NamedPath';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.css'],
})
export class ButtonMenuComponent extends PropertiesMenu implements AfterViewInit{



  @Input() mediator!: EditorMediator;

  protected opcoesBotoes: Array<{ nome: string; path: string }> = [];

  constructor(http: HttpClient) {
    super(http);
  }

  ngAfterViewInit(): void {
    this.opcoesBotoes = botoes;
  }

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
    this.mediator.dragCopyStart(event, img.outerHTML);
  }

  dragEnd(event: DragEvent){
    this.mediator.dragCopyEnd(event)
  }
}
