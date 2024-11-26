import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent {

  @Output() onInput = new EventEmitter<Event>()
  @Input() label: string = ''
  @Input() placeholder!: string

}
