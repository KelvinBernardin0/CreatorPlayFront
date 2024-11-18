import { EditorMediator } from '../../mediator/editor_mediator';
import DragCommand from './drag-command';

export default class DragCopyCommand extends DragCommand {
  constructor(private mediator: EditorMediator) {
    super();
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.mediator.saveCurrentEditorState();
    this.blockUndraggableArea();
    event.dataTransfer?.setData('text/html', opcao.html);
    this.mediator.hideContextMenu();
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault();
    const dropNotAllowed = event.dataTransfer?.dropEffect === 'none'
    if (dropNotAllowed)
      return;

    const target = document.elementFromPoint(event.clientX, event.clientY);
    this.mediator.displayContextMenuOn(target!);
  }
}
