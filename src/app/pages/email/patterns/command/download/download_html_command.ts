import { DomSanitizer } from '@angular/platform-browser';
import Command from '../command';
import { EditorMediator } from '../../mediator/editor_mediator';

type Params = {
  mediator: EditorMediator;
};

export class DownloadHtmlCommand extends Command {
  constructor(private params: Params) {
    super();
  }

  override execute(): void {
    this.saveChanges();
  }

  downloadHTML(html: string, filename: string) {
    const backgroundColor = this.params.mediator.getBackgroundColor();
    const imgRegex = /<img.*?src="(.*?)".*?>/g;
    const matches = Array.from(html.matchAll(imgRegex));

    const promises = [];

    // Função para carregar imagens e converter para base64
    const loadImageToBase64 = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result as string); // Resolve com o conteúdo base64 da imagem
          };
          reader.onerror = reject;
          reader.readAsDataURL(xhr.response); // Lê o conteúdo do blob como Data URL
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob'; // Definir o responseType antes de abrir o request
        xhr.open('GET', src, true); // Abertura do request
        xhr.send(); // Envio do request
      });
    };

    // Iterar sobre todas as correspondências de tags <img>
    for (const match of matches) {
      const imgSrc = match[1]; // Captura o atributo src da tag <img>
      promises.push(
        loadImageToBase64(imgSrc)
          .then((base64) => {
            html = html.replace(imgSrc, base64); // Substituir src da imagem pelo conteúdo base64 no HTML
          })
          .catch((error) => {
            console.error('Erro ao carregar imagem:', error);
          })
      );
    }

    // Aguardar todas as promessas de carregamento de imagens serem resolvidas
    Promise.all(promises)
      .then(() => {
        // Estilizar o HTML com a cor de fundo selecionada
        const styledHTML = `<html><head><style>body { background-color: ${backgroundColor}; }</style></head><body>${html}</body></html>`;

        // Criar o Blob com o HTML estilizado
        const blob = new Blob([styledHTML], { type: 'text/html' });

        // Criar um link temporário para o download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        // Adicionar o link ao documento e simular o clique para iniciar o download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Erro ao processar imagens:', error);
      });
  }

  removeContentEditable(html: string): string {
    // Cria um elemento DOM temporário para manipulação
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove o atributo contenteditable de todos os elementos
    const elements = tempDiv.querySelectorAll('[contenteditable]');
    elements.forEach((element) => {
      element.removeAttribute('contenteditable');
    });

    return tempDiv.innerHTML;
  }

  saveChanges() {
    const headerContainer = document.querySelector('#header-container');
    const contentContainer = document.querySelector('#content-container');
    const footerContainer = document.querySelector('#footer-container');

    if (headerContainer && contentContainer && footerContainer) {
      const headerHTML = headerContainer.outerHTML;
      const contentHTML = contentContainer.outerHTML;
      const footerHTML = footerContainer.outerHTML;

      const combinedHTML = `${headerHTML}${contentHTML}${footerHTML}`;
      const cleanedHTML = this.removeContentEditable(combinedHTML);
      const result = this.removeDisplayNone(cleanedHTML);

      this.downloadHTML(result, 'Email.html');
    }
  }

  removeDisplayNone(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const elements = tempDiv.querySelectorAll('[style*="display: none"]')
    elements.forEach((e) => e.parentElement?.removeChild(e))
    return tempDiv.innerHTML;
  }
}
