import { Component, Input, ViewEncapsulation } from '@angular/core';
import {Position} from '../Position';
import {MovableBaseComponent} from '../moveable-base-component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContextMenuComponent extends MovableBaseComponent{

}
