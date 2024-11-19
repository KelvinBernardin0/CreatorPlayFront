import { AfterViewInit, Component, Input } from '@angular/core';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {NamedHtml} from 'src/app/common/types/NamedHtml';
import PropertiesMenu from '../../abstract/properties-menu';
import {HttpClient} from '@angular/common/http';
import {planos} from '../../../data/planos';
import DragCopyStartCommand from '../../../patterns/command/drag/drag-copy-start-command';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';

@Component({
  selector: 'app-plans-menu',
  templateUrl: './plans-menu.component.html',
  styleUrls: ['./plans-menu.component.css']
})
export class PlansMenuComponent extends PropertiesMenu implements AfterViewInit {


  @Input() override mediator!: EditorMediator
  protected opcoesVitrinePlanos: NamedHtml[] = [];
  termosDeUsoAceitos: boolean = false;

  constructor(http: HttpClient){
    super(http)
  }

  ngAfterViewInit(): void {
    planos.forEach((opcao) => this.getAndPushData(opcao, this.opcoesVitrinePlanos))
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

  dragCopyEnd(event: DragEvent) {
    const command = new DragCopyEndCommand(this.mediator, event)
    this.mediator.executeCommand(command)
  }
  dragCopyStart(event: DragEvent,data: string) {
    const command = new DragCopyStartCommand(this.mediator, event, data)
    this.mediator.executeCommand(command)
  }
}
