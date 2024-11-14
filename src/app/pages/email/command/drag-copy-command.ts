import DragCommand from './drag-command';

type DragCopyCommandParams= {
  saveState: () => void;
  hideContextMenu: () => void;
}
export default class DragCopyCommand extends DragCommand{
  private params: DragCopyCommandParams

  constructor(params: DragCopyCommandParams){
    super()
    this.params = params
  }

  override onDragStart(event: DragEvent, opcao?: any): void {
    this.params.saveState()
    this.blockUndraggableArea()
    event.dataTransfer?.setData('text/html', opcao.html)
    this.params.hideContextMenu()
  }

  override onDragEnd(event: DragEvent): void {
    event.preventDefault()
  }

}
