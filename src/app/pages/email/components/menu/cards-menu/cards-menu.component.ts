import { AfterViewInit, Component, Input, ElementRef } from '@angular/core';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {NamedHtml} from 'src/app/common/types/NamedHtml';
import PropertiesMenu from '../../abstract/properties-menu';
import {HttpClient} from '@angular/common/http';
import {cards} from '../../../data/cards';

@Component({
  selector: 'app-cards-menu',
  templateUrl: './cards-menu.component.html',
  styleUrls: ['./cards-menu.component.css']
})
export class CardsMenuComponent extends PropertiesMenu implements AfterViewInit{

  @Input() mediator!: EditorMediator

  opcoesCards: NamedHtml[] = [];
  termosDeUsoAceitos: boolean = false;

  constructor(
    http: HttpClient
  ){
    super(http)
  }

  ngAfterViewInit(): void {
    cards.forEach((opcao) => this.getAndPushData(opcao, this.opcoesCards));
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
        const container = document.querySelector(selector) as HTMLImageElement;

        if (container) {
          container.src = img.src; // Atualiza o atributo src do elemento img no container específico
          container.style.width = img.style.width; // Atualiza o estilo width do elemento img no container específico
          container.style.height = img.style.height; // Atualiza o estilo height do elemento img no container específico
          container.style.display = img.style.display; // Atualiza o estilo display do elemento img no container específico
          this.mediator.saveCurrentEditorState()
        }
      };

      reader.readAsDataURL(file);
    }
  }

}
