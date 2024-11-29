import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  link: string;
  targetSelector: string;
};
export class InsertLinkToElementCommand extends Command {
  constructor(private params: Params) {
    super();
  }

  override execute(): void {
    const { mediator, link, targetSelector } = this.params;
    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement)
      throw new Error(`Seletor ${targetSelector} não encontrado!`);

    const targetParentIsAnchor = targetElement.parentElement?.nodeName === 'A';

    const formattedLink = !link.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)
      ? 'https://' + link
      : link;

    const aElement = targetParentIsAnchor
      ? (targetElement.parentElement! as HTMLAnchorElement)
      : document.createElement('a');

    if (link === '' && targetParentIsAnchor) {
      aElement.replaceWith(targetElement);
      return;
    }

    aElement.href = formattedLink;
    aElement.title = formattedLink;
    aElement.target = '_blank';
    aElement.style.textDecoration = 'none'
    aElement.style.color = 'inherit'
    aElement.innerHTML = targetElement.outerHTML;

    mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

    // Substituir a imagem original pelo link com a imagem clonada
    targetElement.parentNode?.replaceChild(aElement, targetElement);

    mediator.hideContextMenu();
  }
}
