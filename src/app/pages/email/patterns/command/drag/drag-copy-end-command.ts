import {EditorMediator} from "../../mediator/editor_mediator";
import DragCommand from "./drag-start-command";

export default class DragCopyEndCommand extends DragCommand{

  constructor(
    private mediator: EditorMediator,
    private event: DragEvent
  ){
    super()
  }

  override execute(): void {
    this.event.preventDefault();
    const dropNotAllowed = this.event.dataTransfer?.dropEffect === 'none'
    if (dropNotAllowed)
      return;

    const target = document.elementFromPoint(this.event.clientX, this.event.clientY);
    this.mediator.displayContextMenuOn(target!);
  }

}
