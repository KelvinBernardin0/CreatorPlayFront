import {EventEmitter,Renderer2} from '@angular/core';
import DragCommand from './drag-command';

type DragMoveCommandParams = {
  renderer: Renderer2;
  saveState: EventEmitter<any>;
  updateHoverbleElements: EventEmitter<any>;
  hideElement: () => void;
};
export default class DragMoveCommand extends DragCommand {
  private element: Element | null = null;

  constructor(private params: DragMoveCommandParams) {
    super();
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.params.saveState.emit();
    this.element = opcao;
    this.blockUndraggableArea();
    event.dataTransfer?.setData('text/html', this.element!.outerHTML);
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault();
    const target = document.elementFromPoint(event.clientX, event.clientY);

    if (this.hasUndraggableParent(target))
      return;

    this.params.renderer.removeChild(this.element?.parentNode, this.element);
    this.params.hideElement();
    this.params.updateHoverbleElements.emit();
  }

  private hasUndraggableParent(element: Element | null): boolean {
    if (element?.classList.contains('undraggable-area'))
      return true;

    const parent = element?.parentElement;
    return (parent! && this.hasUndraggableParent(parent))

  }
}
