import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  display: boolean;
  selector: string
  target?: Document
};

export class ChangeDisplayElementCommand extends Command {
  private doc: Document

  constructor(private params: Params) {
    super();
    this.doc = params.target ?? document
  }

  override execute(): void {
    const { mediator, display, selector } = this.params;
    const element = this.doc.querySelector(selector) as HTMLElement
    if (display) {
      element.style.display = 'block';
      mediator.displayHoverBorderOn(element);
      return;
    }
    element.style.display = 'none';
    mediator.hideHoverBorder();
  }
}
