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
    console.log(`Iniciando método onDragStart`)
    this.saveState.emit()
    event.dataTransfer?.setData('text/html', this.innerElement!.outerHTML);
    console.log(`Finalizando método onDragStart`)
  }

  protected onDragEnd(event: DragEvent){
    console.log(`Iniciando método onDragLeave`)
    event.preventDefault()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
    this.updateHoverbleElements.emit()
    console.log(`Finalizando método onDragLeave`)
  }

   protected deleteContent(){
    this.saveState.emit()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
  }
}
