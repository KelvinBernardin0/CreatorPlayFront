import { EditorMediator } from '../../mediator/editor_mediator';
import DragCommand from './drag-command';

export default class DragCopyCommand extends DragCommand<string> {
  constructor(private mediator: EditorMediator) {
    super();
  }

  override onDragStart(event: DragEvent, data: string): void {
    this.mediator.saveCurrentEditorState();
    this.blockUndraggableArea();
    event.dataTransfer?.setData('text/html', data);
    this.mediator.hideContextMenu();
    console.log(data)
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
