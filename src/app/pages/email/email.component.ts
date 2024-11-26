import { footers } from './data/footers';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StringState } from 'src/app/common/types/State';
import { CenteredContentComponent } from './components/centered-content/centered-content.component';
import { ContextMenuComponent } from './components/menu/context-menu/context-menu.component';
import { HoverBorderComponent } from './components/menu/hover-border/hover-border.component';
import Command from './patterns/command/command';
import HistoryStringStateStack from './patterns/command/history/history-string-state-stack';
import { EditorMediator } from './patterns/mediator/editor_mediator';
import { PropertyState } from './patterns/state/propertie-state';
import { HttpClient } from '@angular/common/http';

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

  mostrarPropriedades: boolean = false;
  mostrarHeader: boolean = false;
  mostrarFooter: boolean = false;

  opcoesPropriedades: { nome: string; html: string }[] = [];
  opcoesPropriedadesEmpresas: { nome: string; html: string }[] = [];
  opcoesHeaders!: OpcaoHeader[];
  opcoesFooters: { nome: string; html: string }[] = [];

  selectedBackgroundColor = ''; // Cor de fundo selecionada

  @ViewChild(CenteredContentComponent)
  centeredContentComponent!: CenteredContentComponent;

  @ViewChild(HoverBorderComponent)
  hoverBorderComponent!: HoverBorderComponent;

  @ViewChild(ContextMenuComponent)
  contextMenuComponent!: ContextMenuComponent;

  protected propertyState: PropertyState = 'Vazio';
  protected historyStack = new HistoryStringStateStack(this);
  protected initialState!: StringState;
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) {
    super();
    this.initialState = router.getCurrentNavigation()?.extras
      .state as StringState;
  }

  ngAfterViewInit(): void {
    this.sanitizeState(this.initialState);
    this.changeDetector.detectChanges();
    this.saveCurrentEditorState()
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

  //---------------- APLICA MUDANÇA NO HTML ----------------
  AplicaMudanca(event: any, section: 'header' | 'content' | 'footer') {
    const selectedValue = event.target.value;
    let editableContainer: HTMLElement | null = null;

    // Seleciona a seção apropriada com base no parâmetro `section`
    switch (section) {
      case 'header':
        editableContainer = document.getElementById('header-container');
        break;
      case 'content':
        editableContainer = document.getElementById('content-container');
        break;
      case 'footer':
        editableContainer = document.getElementById('footer-container');
        break;
    }

    if (editableContainer) {
      let selectedOption:
        | { nome: string; html?: string; path?: string }
        | undefined;

      // Verifica em qual array de opções está o valor selecionado
      selectedOption =
        this.opcoesPropriedades.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesFooters.find((opcoes) => opcoes.nome === selectedValue) ||
        this.opcoesPropriedadesEmpresas.find(
          (opcoes) => opcoes.nome === selectedValue
        ) ||
        this.opcoesHeaders.find((opcoes) => opcoes.nome === selectedValue);

      if (selectedOption) {
        const div = document.createElement('div');

        if (selectedOption.html) {
          div.innerHTML = selectedOption.html;
        } else if (selectedOption.path) {
          const img = document.createElement('img');
          img.src = selectedOption.path;
          div.appendChild(img);
        }

        const frag = document.createDocumentFragment();
        let node;
        while ((node = div.firstChild)) {
          frag.appendChild(node);
        }

        this.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

        // Adiciona o conteúdo à seção apropriada
        if (section === 'content') {
          editableContainer.appendChild(frag);
          this.rawEmailHTML = editableContainer.innerHTML;
          this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(
            this.rawEmailHTML
          );
        } else {
          // Para header e footer, substitui o conteúdo inteiro
          editableContainer.innerHTML = '';
          editableContainer.appendChild(frag);
        }
      }
    }
  }
  //---------------- APLICA MUDANÇA NO HTML ----------------

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
    return this.historyStack.getLastState();
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
}
