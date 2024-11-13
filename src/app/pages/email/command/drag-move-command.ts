import { EventEmitter, Renderer2 } from '@angular/core';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import DragCommand from "./drag-command";

type DragMoveCommandParams = {
  renderer: Renderer2;
  saveState: EventEmitter<any>;
  updateHoverbleElements: EventEmitter<any>;
  hideElement: () => void;
}
export default class DragMoveCommand extends DragCommand{
  private element: Element | null= null

  constructor(private params : DragMoveCommandParams){
    super()
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.params.saveState.emit()
    this.element = opcao
    event.dataTransfer?.setData('text/html', this.element!.outerHTML);
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault()

    this.params.renderer.removeChild(this.element?.parentNode, this.element)
    this.params.hideElement()
    this.params.updateHoverbleElements.emit()
  }

}
