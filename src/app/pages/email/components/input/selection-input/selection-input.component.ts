import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NamedValue } from 'src/app/common/types/NamedValue';

@Component({
  selector: 'app-selection-input',
  templateUrl: './selection-input.component.html',
  styleUrls: ['./selection-input.component.css'],
})
export class SelectionInputComponent<T> {
  @Input() label!: string;
  @Input() disabledOption!: string;
  @Input() options!: NamedValue<T>[];
  @Input() selectedOption: NamedValue<T> | null = null;
  @Output() selectedOptionChange = new EventEmitter<NamedValue<T>>();
  @Output() onChange = new EventEmitter<NamedValue<T>>();

  public changeSelectionTo(option: NamedValue<T>): void {
    this.selectedOptionChange.emit(option);
    this.onChange.emit(option);
  }
}
