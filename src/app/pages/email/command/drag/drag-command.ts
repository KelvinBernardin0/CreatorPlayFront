export default abstract class DragCommand{
  abstract onDragStart(event: DragEvent, opcao?: any): void
  abstract onDragEnd(event: DragEvent): void

  blockUndraggableArea() {
    const undraggableArea = document.querySelectorAll(".undraggable-area, .undraggable-area *");
    undraggableArea.forEach((e: Element) => (e as HTMLElement).contentEditable="false");
  }
}
