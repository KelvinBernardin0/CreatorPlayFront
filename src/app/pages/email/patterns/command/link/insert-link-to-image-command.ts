import {EditorMediator} from "../../mediator/editor_mediator";
import Command from "../command";

export class InsertLinkToImageCommand extends Command{

  constructor(
    private mediator: EditorMediator,
  ){
    super()
  }

  override execute(): void {
    {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer as HTMLElement;

      const imgElement = container.querySelector('img');
      if (imgElement) {
        let link = prompt('Digite o URL do link:');
        if (link) {
          // Verificar se o link é relativo e convertê-lo para absoluto
          if (!link.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
            link = 'https://' + link;
          }

          const aElement = document.createElement('a');
          aElement.href = link;
          aElement.target = '_blank';
          aElement.title = link; // Define o tooltip para exibir o link

          // Clonar a imagem e adicionar ao link
          const imgClone = imgElement.cloneNode(true);
          aElement.appendChild(imgClone);

          this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

          // Substituir a imagem original pelo link com a imagem clonada
          imgElement.parentNode?.replaceChild(aElement, imgElement);

          // Atualizar o HTML
          // this.atualizarHTML();
        }
      } else {
        alert('Por favor, selecione uma imagem primeiro.');
      }
    }
  }
  }

}
