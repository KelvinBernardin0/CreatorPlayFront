import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {DomSanitizer,SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {StringState} from 'src/app/common/types/State';
import {CenteredContentComponent} from './components/centered-content/centered-content.component';
import {ContextMenuComponent} from './components/menu/context-menu/context-menu.component';
import {HoverBorderComponent} from './components/menu/hover-border/hover-border.component';
import Command from './patterns/command/command';
import HistoryStringStateStack from './patterns/command/history/history-string-state-stack';
import {EditorMediator} from './patterns/mediator/editor_mediator';
import {PropertyState} from './patterns/state/propertie-state';
import { TypographyMenuComponent } from './components/menu/typography-menu/typography-menu.component';

interface OpcaoHeader {
  nome: string;
  path: string;
  html?: string;
}
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EmailComponent extends EditorMediator implements AfterViewInit {
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';

  headerHTML: SafeHtml = '';
  contentHTML: SafeHtml = '';
  footerHTML: SafeHtml = '';

  selectedBackgroundColor = '#ffff'; // Cor de fundo selecionada

  @ViewChild(CenteredContentComponent)
  centeredContentComponent!: CenteredContentComponent;

  @ViewChild(HoverBorderComponent)
  hoverBorderComponent!: HoverBorderComponent;

  @ViewChild(ContextMenuComponent)
  contextMenuComponent!: ContextMenuComponent;

  @ViewChild(TypographyMenuComponent) 
  typographyMenuComponent!: TypographyMenuComponent;


  protected propertyState: PropertyState = 'Vazio';
  protected historyStack = new HistoryStringStateStack(this);
  protected initialState!: StringState;
  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
    router: Router
  ) {
    super();
    this.initialState = router.getCurrentNavigation()?.extras
      .state as StringState;
  }

  ngAfterViewInit(): void {
    this.sanitizeState(this.initialState);
    this.changeDetector.detectChanges();
    this.saveCurrentEditorState();
  }

  //---------------- FUNCIONAMENTO DO HTML ----------------

  sanitizeState(state: StringState) {
    this.headerHTML = this.sanitizer.bypassSecurityTrustHtml(
      state.header ?? ''
    );
    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(
      state.content ?? ''
    );
    this.footerHTML = this.sanitizer.bypassSecurityTrustHtml(
      state.footer ?? ''
    );
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
    this.hideContextMenu();
  }
  override getSelectedElement(): Element | null {
    return this.contextMenuComponent.innerElement;
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

  override getCurrentEditorState(): StringState {
    return this.centeredContentComponent.getCurrentEditorState();
  }

  override displayHoverBorderOn(element: Element): void {
    this.hoverBorderComponent.displayComponentOn(element);
  }
  override hideHoverBorder(): void {
    this.hoverBorderComponent.hide();
  }

  override changePropertiesState(state: PropertyState): void {
    this.propertyState = state;
  }

  override executeCommand(command: Command): void {
    command.execute();
  }

  override executeCommands(commands: Command[]): void {
    commands.forEach((c) => c.execute());
  }

  override changeBackgroundColor(color: string): void {
    this.selectedBackgroundColor = color;
  }
  override getBackgroundColor(): string {
    return this.selectedBackgroundColor;
  }

  override openTextEditor(texto: string): void {
    console.log('Texto recebido para edição:', texto);
    this.typographyMenuComponent.openTextEditor(texto); // Chama o editor com o texto selecionado
  }

  
  
}
