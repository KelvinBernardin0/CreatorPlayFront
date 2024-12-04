import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-input',
  templateUrl: './toggle-input.component.html',
  styleUrls: ['./toggle-input.component.css']
})
export class ToggleInputComponent {

  @Input() label!: string
  @Input() value!: boolean;
  @Output() valueChange = new EventEmitter<boolean>();

}
