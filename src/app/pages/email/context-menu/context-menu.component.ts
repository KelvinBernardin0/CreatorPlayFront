import { Component, EventEmitter, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import {MovableBaseComponent} from '../moveable-base-component';
import DragMoveCommand from '../command/drag-move-command';
import DragCommand from '../command/drag-command';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContextMenuComponent extends MovableBaseComponent{

  protected MINIMUM_WIDTH_SIZE: number =  250
  protected dragMoveCommand: DragCommand

  constructor(
    protected renderer: Renderer2,
  ){
    super()
    this.dragMoveCommand = new DragMoveCommand({
      renderer: renderer,
      saveState: this.saveState,
      updateHoverbleElements: this.updateHoverbleElements,
      hideElement: () => this.hide()
    })
  }

  @Output() saveState = new EventEmitter()
  @Output() updateHoverbleElements = new EventEmitter()


   protected deleteContent(){
    this.saveState.emit()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
  }

}
