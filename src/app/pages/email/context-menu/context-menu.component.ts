import { Component, EventEmitter, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import {MovableBaseComponent} from '../moveable-base-component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContextMenuComponent extends MovableBaseComponent{

  protected MINIMUM_WIDTH_SIZE: number =  250

  constructor(
    private renderer: Renderer2,
  ){
    super()
  }

  @Output() saveState = new EventEmitter()
  @Output() updateHoverbleElements = new EventEmitter()

  protected onDragStart(event: DragEvent) {
    this.saveState.emit()
    event.dataTransfer?.setData('text/html', this.innerElement!.outerHTML);
  }

  protected onDragEnd(event: DragEvent){
    event.preventDefault()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
    this.updateHoverbleElements.emit()
  }

   protected deleteContent(){
    this.saveState.emit()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
  }
}
