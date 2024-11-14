import { Component } from '@angular/core';
import {Position} from '../../../../common/types/Position';
import {MovableBaseComponent} from '../abstract/moveable-base-component';

@Component({
  selector: 'app-hover-border',
  templateUrl: './hover-border.component.html',
  styleUrls: ['./hover-border.component.css']
})
export class HoverBorderComponent extends MovableBaseComponent {

}
