import DragCommand from "./drag-command";
import {EmailComponent} from "../email.component";

type DragDropCommandParams= {
  saveState: () => void;
  blockUndraggableArea: () => void;
  hideContextMenu: () => void;
}
export default class DragCopyCommand extends DragCommand{
  private params: DragDropCommandParams

  constructor(params: DragDropCommandParams){
    super()
    this.params = params
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.params.saveState()
    this.params.blockUndraggableArea()
    event.dataTransfer?.setData('text/html', opcao.html)
    this.params.hideContextMenu()
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault()
  }

}
