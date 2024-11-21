import Command from "../command";

export default abstract class DragCommand extends Command{

  blockUndraggableArea() {
    const undraggableArea = document.querySelectorAll(
      '.undraggable-area, .undraggable-area *'
    );
    undraggableArea.forEach(
      (e: Element) => ((e as HTMLElement).contentEditable = 'false')
    );
  }
}
