
import {StringState} from '../../../../common/types/State';
import {PropertyState} from '../state/propertie-state';

export abstract class EditorMediator{
  abstract changePropertiesState(state: PropertyState): void

  abstract saveNewEditorState(stringState: StringState): void
  abstract saveCurrentEditorState(): void
  abstract undoEditorState(): void
  abstract updateEditorState(StringState: StringState): void
  abstract getCurrentEditorState(): StringState | null

  abstract displayContextMenuOn(element: Element): void
  abstract getSelectedElement(): Element | null
  abstract hideContextMenu(): void
  abstract updateHoverbleElements(): void

  abstract displayHoverBorderOn(element: Element): void
  abstract hideHoverBorder(): void

  abstract dragCopyStart(event: DragEvent, data: String): void
  abstract dragCopyEnd(event: DragEvent): void
  abstract dragMoveStart(event: DragEvent, data: Element): void
  abstract dragMoveEnd(event: DragEvent): void


}
