export default abstract class DragCommand<T>{
  abstract onDragStart(event: DragEvent, data: T): void
  abstract onDragEnd(event: DragEvent): void

  blockUndraggableArea() {
    const undraggableArea = document.querySelectorAll(".undraggable-area, .undraggable-area *");
    undraggableArea.forEach((e: Element) => (e as HTMLElement).contentEditable="false");
  }
}
