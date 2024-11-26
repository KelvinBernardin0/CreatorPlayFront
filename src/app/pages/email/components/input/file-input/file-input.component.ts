import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})
export class FileInputComponent {

  @Input() label!: string
  @Output() fileSelected = new EventEmitter<Event>()
  @Input() disabled!: boolean

  protected fileName: string | null = null

  protected onFileSelected(event: Event){
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.fileName = file.name
    this.fileSelected.emit(event)
  }

}
