
import {StringState} from '../../../../common/types/State';
import Command from '../command/drag/drag-start-command';
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

  abstract executeCommand(command: Command): void

}
