import {Component,Input,Renderer2,ViewEncapsulation} from '@angular/core';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {MovableBaseComponent} from '../../abstract/moveable-base-component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContextMenuComponent extends MovableBaseComponent{

  protected MINIMUM_WIDTH_SIZE: number =  250
  @Input() editorMediator!: EditorMediator

  constructor(
    protected renderer: Renderer2,
  ){
    super()
  }

   protected deleteContent(){
    this.editorMediator.saveCurrentEditorState()
    this.renderer.removeChild(this.innerElement?.parentNode, this.innerElement)
    this.hide()
  }
}
