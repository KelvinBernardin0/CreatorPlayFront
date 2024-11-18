import {EventEmitter,Renderer2} from '@angular/core';
import DragCommand from './drag-command';
import {EditorMediator} from '../../mediator/editor_mediator';

type DragMoveCommandParams = {
  renderer: Renderer2;
  editorMediator: EditorMediator;
};
export default class DragMoveCommand extends DragCommand {
  private element: Element | null = null;

  constructor(private params: DragMoveCommandParams) {
    super();
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.params.editorMediator.saveCurrentEditorState();
    this.element = opcao;
    this.element?.setAttribute('draggable', 'true')
    this.blockUndraggableArea();
    event.dataTransfer?.setData('text/html', this.element!.outerHTML);
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault();
    const target = document.elementFromPoint(event.clientX, event.clientY);

    const dropNotAllowed = event.dataTransfer?.dropEffect === 'none'

    if (dropNotAllowed || this.hasUndraggableParent(target?.parentElement!))
      return;

    this.params.renderer.removeChild(this.element?.parentNode, this.element);
    this.params.editorMediator.hideContextMenu()
    this.params.editorMediator.updateHoverbleElements();
  }

  private hasUndraggableParent(element: Element | null): boolean {
    if (element?.classList.contains('undraggable-area'))
      return true;

    const parent = element?.parentElement;
    return (parent! && this.hasUndraggableParent(parent))

  }
}
