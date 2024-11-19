import {Component,Input} from '@angular/core';

@Component({
  selector: 'app-selection-input',
  templateUrl: './selection-input.component.html',
  styleUrls: ['./selection-input.component.css']
})
export class SelectionInputComponent {

  @Input() label!: string
  @Input() disabledOption!: string
  @Input() options!: string[]
  @Input() onChange!: (event: Event) => void


}
