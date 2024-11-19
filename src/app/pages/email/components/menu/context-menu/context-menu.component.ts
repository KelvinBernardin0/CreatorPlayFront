import {Component,Input,Renderer2,ViewEncapsulation} from '@angular/core';
import DragMoveEndCommand from '../../../patterns/command/drag/drag-move-end-command';
import DragMoveStartCommand from '../../../patterns/command/drag/drag-move-start-command';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {MovableBaseComponent} from '../../abstract/moveable-base-component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContextMenuComponent extends MovableBaseComponent {
  protected MINIMUM_WIDTH_SIZE: number = 250;
  @Input() mediator!: EditorMediator;

  constructor(protected renderer: Renderer2) {
    super();
  }

  protected deleteContent() {
    this.mediator.saveCurrentEditorState();
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement);
    this.hide();
  }

  dragMoveEnd(event: DragEvent) {
    const command = new DragMoveEndCommand(this.mediator, event, this.renderer)
    this.mediator.executeCommand(command)
  }
  dragMoveStart(event: DragEvent, data: Element) {
    const command = new DragMoveStartCommand(this.mediator, event, data)
    this.mediator.executeCommand(command)
  }
}
