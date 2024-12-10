import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  text: string;
  selector: string;
  target?: Document;
};

export class EditTextContentCommand extends Command {
  private target: Document ;

  constructor(private params: Params) {
    super();
    this.target = params.target ?? document; // Define o valor padrão para target
  }

  override execute(): void {
    const { mediator, text, selector } = this.params;
    const element = (this.target).querySelector(selector) as HTMLElement;
    if (!element) throw new Error(`Seletor ${selector} não encontrado!`);

    mediator.hideContextMenu();
    element.innerHTML = text;
    mediator.displayHoverBorderOn(element);
  }
}
