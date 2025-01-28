import { EditorMediator } from '../../mediator/editor_mediator';
import DragCommand from './drag-command';

export default class DragCopyStartCommand extends DragCommand {
  private static nextId = 1; // Contador para gerar IDs únicos

  constructor(
    private mediator: EditorMediator,
    private event: DragEvent,
    private data: string
  ) {
    super();
  }

  override execute(): void {
    let styles = {
      'background-color': '#49066B',
      'border-radius': '28px',
      'border': '1px solid #49066B',
      'display': 'inline-block',
      'cursor': 'pointer',
      'color': '#ffffff',
      'font-family': 'Arial',
      'font-size': '17px',
      'padding': '16px 31px',
      'text-decoration': 'none',
    };

    this.mediator.saveCurrentEditorState();
    this.blockUndraggableArea();

    const uniqueId = `text-block-${DragCopyStartCommand.nextId++}`; // Gerar ID único
    const blocoTexto = `<div draggable="true" id="${uniqueId}" class="bloco-texto" contenteditable="true">${this.data}</div>`;

    const styleString = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');

    const blocoBotao = `<div draggable="true" id="${uniqueId}" class="bloco-botao"><a id="linkBtn"><button  class="btn-outline-info bloco-botao-btn" style="${styleString}"> Botão </button></a></div>`;

    let htmlData = '';

    switch (this.data) {
      case 'Botão':
        htmlData = blocoBotao;
        break;
      case 'Texto':
        htmlData = blocoTexto;
        break;
      default:
        htmlData = blocoTexto;
        break;
    }

    this.event.dataTransfer?.setData('text/html', htmlData);
    this.mediator.hideContextMenu();
  }
}
