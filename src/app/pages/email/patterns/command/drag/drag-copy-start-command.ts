import {EditorMediator} from '../../mediator/editor_mediator';
import DragCommand from './drag-command';

export default class DragCopyStartCommand extends DragCommand {

  constructor(
    private mediator: EditorMediator,
    private event: DragEvent,
    private data: string
  ){
    super()
  }

  override execute(): void {
    this.mediator.saveCurrentEditorState();
    this.blockUndraggableArea();
    this.event.dataTransfer?.setData('text/html', this.data);
    this.mediator.hideContextMenu();
  }
}
