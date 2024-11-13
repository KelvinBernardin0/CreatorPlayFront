export default abstract class DragCommand{
  abstract onDragStart(event: DragEvent, opcao?: any): void
  abstract onDragEnd(event: DragEvent): void
}
