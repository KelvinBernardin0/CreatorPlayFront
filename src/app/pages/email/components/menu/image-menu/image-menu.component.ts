import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import PropertiesMenu from '../../abstract/properties-menu';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {StringState} from 'src/app/common/types/State';

@Component({
  selector: 'app-image-menu',
  templateUrl: './image-menu.component.html',
  styleUrls: ['./image-menu.component.css']
})
export class ImageMenuComponent extends PropertiesMenu{

  @Input() override mediator!: EditorMediator

  protected selectedImageSize: string = 'G';
  protected lastUploadedImg: HTMLImageElement | null = null; // Para armazenar a última imagem carregada
  protected termosDeUsoAceitos: boolean = false;

  constructor(
    http: HttpClient
  ){
    super(http)
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

        const state = this.mediator.getCurrentEditorState()
        const content = state?.content
        if(content){
          const newState: StringState = {
            header: state!.header,
            footer: state!.footer,
            content: img.outerHTML
          }

          this.mediator.updateEditorState(newState)
          this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração
        }
      };

      reader.readAsDataURL(file);
    }
  }
}
