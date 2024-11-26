import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  element: HTMLElement;
  display: boolean;
};

export class ChangeDisplayElementCommand extends Command {
  constructor(private params: Params) {
    super();
  }

  override execute(): void {
    const { mediator, element, display } = this.params;
    if (display) {
      element.style.display = 'block';
      mediator.displayHoverBorderOn(element);
      return;
    }
    element.style.display = 'none';
    mediator.hideHoverBorder();
  }
}
