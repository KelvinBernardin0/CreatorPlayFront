import {StringState} from './../../../common/types/State';

export abstract class EditorMediator{

  abstract saveNewEditorState(stringState: StringState): void
  abstract saveCurrentEditorState(): void
  abstract undoEditorState(): void
  abstract updateEditorState(StringState: StringState): void

  abstract displayContextMenuOn(element: Element): void
  abstract hideContextMenu(): void
  abstract updateHoverbleElements(): void

  abstract displayHoverBorderOn(element: Element): void
  abstract hideHoverBorder(): void

  abstract dragCopyStart(event: DragEvent, opcao?: any): void
  abstract dragCopyEnd(event: DragEvent): void
  abstract dragMoveStart(event: DragEvent, opcao?: any): void
  abstract dragMoveEnd(event: DragEvent): void


}
