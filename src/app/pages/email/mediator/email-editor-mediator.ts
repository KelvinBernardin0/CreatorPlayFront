import { HoverBorderComponent } from '../components/hover-border/hover-border.component';
import { CenteredContentComponent } from '../components/centered-content/centered-content.component';
import {StringState} from "src/app/common/types/State";
import {EditorMediator} from "./editor_mediator";
import DragCopyCommand from "../command/drag/drag-copy-command";
import DragMoveCommand from "../command/drag/drag-move-command";
import HistoryStringStateCommand from "../command/history/history-string-state-command";
import {state} from "@angular/animations";
import {Renderer2} from '@angular/core';
import {ContextMenuComponent} from '../components/context-menu/context-menu.component';

export class EmailEditorMediator extends EditorMediator{

  private historyCommand!: HistoryStringStateCommand
  private dragMoveCommand!: DragMoveCommand
  private dragCopyCommand!: DragCopyCommand

  constructor(
    private renderer: Renderer2,
    private centeredContentComponent: CenteredContentComponent,
    private contextMenuComponent: ContextMenuComponent,
    private hoverBorderComponent: HoverBorderComponent,
  ){
    super()
    this.historyCommand = new HistoryStringStateCommand(this)
    this.dragCopyCommand = new DragCopyCommand(this);
    this.dragMoveCommand = new DragMoveCommand({
      renderer: renderer,
      editorMediator: this
    })
  }

  override saveNewEditorState(stringState: StringState): void {
    this.historyCommand.save(stringState)
  }

  override updateEditorState(state: StringState): void {
    this.centeredContentComponent.atualizarHTML(state)
  }

  override updateHoverbleElements(): void {
    this.centeredContentComponent.updateHoverbleElements()
  }
  override undoEditorState(): void {
    this.historyCommand.undo()
  }
  override hideContextMenu(): void {
    this.contextMenuComponent.hide()
  }

  override displayContextMenuOn(element: Element): void {
    this.contextMenuComponent.displayComponentOn(element);
  }

  override saveCurrentEditorState(): void {
    this.centeredContentComponent.saveState();
  }
  override dragCopyStart(event: DragEvent, opcao?: any): void {
    this.dragCopyCommand.onDragStart(event, opcao);
  }
  override dragCopyEnd(event: DragEvent): void {
    this.dragCopyCommand.onDragEnd(event);
  }

  override dragMoveStart(event: DragEvent,opcao?: any): void {
    this.dragMoveCommand.onDragStart(event, opcao)
  }
  override dragMoveEnd(event: DragEvent): void {
    this.dragMoveCommand.onDragEnd(event)
  }

  override displayHoverBorderOn(element: Element): void {
    this.hoverBorderComponent.displayComponentOn(element)
  }
  override hideHoverBorder(): void {
    this.hoverBorderComponent.hide()
  }
}
