import {AfterViewInit,Component,Input} from '@angular/core';
import {DomSanitizer,SafeHtml} from '@angular/platform-browser';
import {StringState} from 'src/app/common/types/State';
import {EditorMediator} from '../../patterns/mediator/editor_mediator';

@Component({
  selector: 'app-centered-content',
  templateUrl: './centered-content.component.html',
  styleUrls: ['./centered-content.component.css']
})
export class CenteredContentComponent implements AfterViewInit {


  selectedBackgroundColor = ''

  @Input() headerHTML: SafeHtml = '';
  @Input() contentHTML: SafeHtml = '';
  @Input() footerHTML: SafeHtml = '';
  @Input() editorMediator!: EditorMediator

  currentRange: Range | null = null; //Para armazenar a posição atual do cursor

  lastUploadedImg: HTMLImageElement | null = null; // Para armazenar a última imagem carregada

  constructor(
    private sanitizer: DomSanitizer,
  ){

  }
  ngAfterViewInit(): void {
    this.updateHoverbleElements()
  }


  public updateHoverbleElements() {
    const centerElements = document.querySelectorAll("#email-container *")
    centerElements.forEach((element: Element) => {
      const isHtmlElement = element.nodeType===1;
        const moveableComponents = ['APP-CONTEXT-MENU', 'APP-HOVER-BORDER'].includes(element.tagName)
        if(isHtmlElement && !moveableComponents) {
          this.addHoverEventsOn(element);
          element.setAttribute('draggable', 'false')
        }
      });
    }

    private addHoverEventsOn(element: Element): void {
      element.removeEventListener('mouseenter',() => this.editorMediator.displayHoverBorderOn(element))
      element.removeEventListener('mouseleave',() => this.editorMediator.hideHoverBorder());
      element.addEventListener('mouseenter',() => this.editorMediator.displayHoverBorderOn(element));
      element.addEventListener('mouseleave',() => this.editorMediator.hideHoverBorder());
    }

    makeEditable(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target && target.nodeType === 1) {
        target.setAttribute('contenteditable', 'true');
        this.editorMediator.displayContextMenuOn(target)
      }else{
        this.editorMediator.hideContextMenu()
      }

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.currentRange = selection.getRangeAt(0);
      }

      // Limpe a última imagem carregada ao tornar o conteúdo editável novamente
      this.lastUploadedImg = null;
    }

    public saveState(): void{
      this.executeOnContents((header, content, footer) => {
        this.editorMediator.saveNewEditorState({
          header: header,
          content: content,
          footer: footer
        })
      })
    }

    onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Control')
        return

      const deleteEvent=event.key==='Delete'||event.key==='Backspace';
      if (deleteEvent) {
        this.saveState(); // Salvar o estado antes de deletar
        return
      }
      const undoEvent = (event.metaKey || event.ctrlKey) && ( event.key === "z" || event.key === "Z");
      if (undoEvent) {
        event.preventDefault();
        this.editorMediator.undoEditorState();
        this.editorMediator.hideContextMenu()
        return
      }

      this.saveState()
    }

    public atualizarHTML(state: StringState): void {
      this.executeOnContents(() => {
        this.headerHTML = this.sanitizer.bypassSecurityTrustHtml(state.header);
        this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(state.content);
        this.footerHTML = this.sanitizer.bypassSecurityTrustHtml(state.footer);
      })
    }

    private executeOnContents(task: (header: string, content: string, footer: string) => void): void{
      const headerContainer = document.getElementById('header-container');
      const contentContainer = document.getElementById('content-container');
      const footerContainer = document.getElementById('footer-container');

      if (headerContainer && contentContainer && footerContainer)
        task(headerContainer.innerHTML, contentContainer.innerHTML, footerContainer.innerHTML)
    }


}
