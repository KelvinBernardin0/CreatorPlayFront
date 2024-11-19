import {EditorMediator} from "../../mediator/editor_mediator";
import DragCommand from "./drag-start-command";

export default class DragButtonStartCommand<T> extends DragCommand{

  constructor(
    protected mediator: EditorMediator,
    protected event: DragEvent,
    protected data: T
  ){
    super()
  }

  override execute(): void {
    this.mediator.hideContextMenu()
    this.mediator.saveCurrentEditorState()
    this.blockUndraggableArea()
  }

}
