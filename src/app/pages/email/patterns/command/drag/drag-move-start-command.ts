import {EditorMediator} from "../../mediator/editor_mediator";
import DragCommand from "./drag-command";

export default class DragMoveStartCommand extends DragCommand{

  constructor(
    private mediator: EditorMediator,
    private event: DragEvent,
    private element: Element
  ){
    super()
  }

  override execute(): void {
    this.mediator.saveCurrentEditorState();
    this.element.setAttribute('draggable', 'true')
    this.blockUndraggableArea();
    this.event.dataTransfer?.setData('text/html', this.element!.outerHTML);
  }

}
