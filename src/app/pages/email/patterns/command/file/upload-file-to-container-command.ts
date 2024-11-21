import {EditorMediator} from "../../mediator/editor_mediator";
import Command from "../command";

export default class UploadFileToContainerCommand extends Command{
  constructor(
    private mediator: EditorMediator,
    private event: Event,
    private selector: string
  ){
    super()
  }

  override execute(): void {
    this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

    const element = this.event.currentTarget as HTMLInputElement
    const file = element.files![0]
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
        const container = document.querySelector(this.selector) as HTMLImageElement;

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
