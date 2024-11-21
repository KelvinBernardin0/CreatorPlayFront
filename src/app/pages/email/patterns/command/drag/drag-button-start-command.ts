import {EditorMediator} from "../../mediator/editor_mediator";
import DragCommand from "./drag-command";

export default class DragButtonStartCommand extends DragCommand{

  constructor(
    protected mediator: EditorMediator,
    protected event: DragEvent,
    protected path: string
  ){
    super()
  }

  override execute(): void {
    this.mediator.hideContextMenu()
    this.mediator.saveCurrentEditorState()
    this.blockUndraggableArea()
  }

}
