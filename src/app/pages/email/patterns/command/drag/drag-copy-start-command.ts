import { EditorMediator } from '../../mediator/editor_mediator';
import DragCommand from './drag-command';

export default class DragCopyStartCommand extends DragCommand {

  private static nextId = 1; // Contador para gerar IDs únicos

  
  constructor(
    private mediator: EditorMediator,
    private event: DragEvent,
    private data: string
  ) {
    super();
  }

 

  override execute(): void {
    this.mediator.saveCurrentEditorState();
    this.blockUndraggableArea();

    const uniqueId = `text-block-${DragCopyStartCommand.nextId++}`; // Gerar ID único
    const blocoTexto = `<div draggable="true" id="${uniqueId}" class="bloco-texto" contenteditable="true">${this.data}</div>`;

    this.event.dataTransfer?.setData('text/html', blocoTexto);
    this.mediator.hideContextMenu();

  }


}
