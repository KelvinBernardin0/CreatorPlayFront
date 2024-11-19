import {Renderer2} from '@angular/core';
import {StringState} from 'src/app/common/types/State';
import {CenteredContentComponent} from '../../components/centered-content/centered-content.component';
import {ContextMenuComponent} from '../../components/menu/context-menu/context-menu.component';
import {HoverBorderComponent} from '../../components/menu/hover-border/hover-border.component';
import {EmailComponent} from '../../email.component';
import Command from '../command/drag/drag-start-command';
import HistoryStringStateStack from '../command/history/history-string-state-stack';
import {PropertyState} from './../state/propertie-state';
import {EditorMediator} from './editor_mediator';

export class EmailEditorMediator extends EditorMediator {

  private historyStack!: HistoryStringStateStack;

  constructor(
    private emailComponent: EmailComponent,
    private centeredContentComponent: CenteredContentComponent,
    private contextMenuComponent: ContextMenuComponent,
    private hoverBorderComponent: HoverBorderComponent
  ) {
    super();
    this.historyStack = new HistoryStringStateStack(this);
  }

  override saveNewEditorState(stringState: StringState): void {
    this.historyStack.save(stringState);
  }

  override updateEditorState(state: StringState): void {
    this.centeredContentComponent.atualizarHTML(state);
  }

  override updateHoverbleElements(): void {
    this.centeredContentComponent.updateHoverbleElements();
  }
  override undoEditorState(): void {
    this.historyStack.undo();
    this.hideContextMenu()
  }
  override getSelectedElement(): Element|null {
    return this.contextMenuComponent.innerElement
  }
  override hideContextMenu(): void {
    this.contextMenuComponent.hide();
  }

  override displayContextMenuOn(element: Element): void {
    this.contextMenuComponent.displayComponentOn(element);
  }

  override saveCurrentEditorState(): void {
    this.centeredContentComponent.saveState();
  }

  override getCurrentEditorState(): StringState | null{
    return this.historyStack.getLastState();
  }

  override displayHoverBorderOn(element: Element): void {
    this.hoverBorderComponent.displayComponentOn(element);
  }
  override hideHoverBorder(): void {
    this.hoverBorderComponent.hide();
  }

  override changePropertiesState(state: PropertyState): void {
    this.emailComponent.changePropertiesState(state);
  }

  override executeCommand(command: Command): void {
    command.execute();
  }
}
