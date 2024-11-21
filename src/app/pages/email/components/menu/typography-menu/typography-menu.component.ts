import {HttpClient} from '@angular/common/http';
import {AfterViewInit,Component,Input} from '@angular/core';
import {NamedHtml} from '../../../../../common/types/NamedHtml';
import {descricoes} from '../../../data/descricoes';
import {links} from '../../../data/links';
import {titulos} from '../../../data/titulos';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';
import DragCopyStartCommand from '../../../patterns/command/drag/drag-copy-start-command';

@Component({
  selector: 'app-typography-menu',
  templateUrl: './typography-menu.component.html',
  styleUrls: ['./typography-menu.component.css']
})
export class TypographyMenuComponent extends PropertiesMenu implements AfterViewInit {

  @Input() override mediator!: EditorMediator
  opcoesTitulos: NamedHtml[] = [];
  opcoesDescricoes: NamedHtml[] = [];
  opcoesLinks: NamedHtml[] = [];


  constructor(
    http: HttpClient,
  ){
    super(http)
  }

  ngAfterViewInit(): void {
    titulos.forEach((opcao) => this.getAndPushData(opcao, this.opcoesTitulos));
    descricoes.forEach((opcao) => this.getAndPushData(opcao, this.opcoesDescricoes));
    links.forEach((opcao) => this.getAndPushData(opcao, this.opcoesLinks));
  }


  AplicaCor(cor: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedContents = range.extractContents();
      const span = document.createElement('span');
      span.style.color = cor;

      span.appendChild(selectedContents);
      range.insertNode(span);

      this.mediator.saveCurrentEditorState()
    }
  }

  aplicaEstiloSelecionado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return; // Retorna se nenhum valor estiver selecionado

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return; // Retorna se não houver seleção

    const range = selection.getRangeAt(0);
    const selectedContents = range.extractContents();

    const span = document.createElement('span');
    switch (selectedValue) {
      case 'bold':
        span.style.fontWeight = 'bold';
        break;
      case 'italic':
        span.style.fontStyle = 'italic';
        break;
      case 'underline':
        span.style.textDecoration = 'underline';
        break;
      default:
        break;
    }

    span.appendChild(selectedContents);
    range.insertNode(span);

    // Atualiza o HTML após aplicar o estilo
    this.mediator.saveCurrentEditorState()
  }
}
