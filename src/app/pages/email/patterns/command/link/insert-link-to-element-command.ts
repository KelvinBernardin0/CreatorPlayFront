import { EditorMediator } from '../../mediator/editor_mediator';
import Command from '../command';

type Params = {
  mediator: EditorMediator;
  link: string;
  targetSelector: string;
  target?: Document
};
export class InsertLinkToElementCommand extends Command {
  constructor(private params: Params) {
    super();
  }

  override execute(): void {
    const { mediator, link, targetSelector, target } = this.params;
    const targetElement = (target ?? document).querySelector(targetSelector) as HTMLElement;
    if (!targetElement)
      throw new Error(`Seletor ${targetSelector} não encontrado!`);

    const existingAnchor = targetElement.closest('a') as HTMLAnchorElement;

    const formattedLink = !link.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)
      ? 'https://' + link
      : link;

    const aElement = existingAnchor || document.createElement('a');

    if (link === '' && existingAnchor) {
      existingAnchor.replaceWith(targetElement);
      return;
    }

    aElement.href = formattedLink;
    aElement.title = formattedLink;
    aElement.target = '_blank';
    aElement.style.textDecoration = 'none';
    aElement.style.color = 'inherit';

    if (!existingAnchor) {
      aElement.innerHTML = targetElement.outerHTML;
      targetElement.parentNode?.replaceChild(aElement, targetElement);
    }

    mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração
    mediator.hideContextMenu();
  }
  /**
   * Problema Identificado 30/01/25
  O problema ocorre porque a lógica de substituição do elemento está criando um novo <a> quando o targetElement não tem um pai <a>. Se o targetElement já estiver dentro de um <a>, ele reutiliza o pai <a>, mas se não estiver, ele cria um novo <a>.

  Solução
  Para garantir que o link seja atualizado no <a> existente, você pode modificar a lógica para sempre procurar um <a> existente antes de criar um novo. Aqui está a modificação:
    */
}
