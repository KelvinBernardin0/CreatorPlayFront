import {Component,EventEmitter,Input, Output} from '@angular/core';
import {NamedValue} from 'src/app/common/types/NamedValue';

@Component({
  selector: 'app-selection-input',
  templateUrl: './selection-input.component.html',
  styleUrls: ['./selection-input.component.css']
})
export class SelectionInputComponent {

  @Input() label!: string
  @Input() disabledOption!: string
  @Input() options!: NamedValue<string>[]
  @Output() onChange = new EventEmitter<Event>()




}
