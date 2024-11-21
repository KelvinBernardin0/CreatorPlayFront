import {Renderer2} from "@angular/core";
import {EditorMediator} from "../../mediator/editor_mediator";
import DragCommand from "./drag-command";

export default class DragMoveEndCommand extends DragCommand{

  constructor(
    private mediator: EditorMediator,
    private event: DragEvent,
    private renderer: Renderer2
  ){
    super()
  }

  override execute(): void {
    this.event.preventDefault();
    const target = document.elementFromPoint(this.event.clientX, this.event.clientY);

    const dropNotAllowed = this.event.dataTransfer?.dropEffect === 'none'

    if (dropNotAllowed || this.hasUndraggableParent(target?.parentElement!))
      return;

    const element = this.mediator.getSelectedElement()
    this.renderer.removeChild(element?.parentNode, element);
    this.mediator.hideContextMenu()
    this.mediator.updateHoverbleElements();
  }

  private hasUndraggableParent(element: Element | null): boolean {
    if (element?.classList.contains('undraggable-area'))
      return true;

    const parent = element?.parentElement;
    return (parent! && this.hasUndraggableParent(parent))

  }

}
