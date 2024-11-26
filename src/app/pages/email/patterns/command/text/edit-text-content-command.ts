import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  text: string;
  selector: string;
};
export class EditTextContentCommand extends Command {
  constructor(private params: Params) {
    super();
  }

  override execute(): void {
    const { mediator, text, selector } = this.params;
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) throw new Error(`Seletor ${selector} não encontrado!`);


    mediator.hideContextMenu();
    element.innerHTML = text;
    mediator.displayHoverBorderOn(element)

  }
}
