import { EmailService } from "src/app/services/email/email.service";
import {EditorMediator} from "../../mediator/editor_mediator";
import Command from "../command";
import { SafeHtml } from "@angular/platform-browser";

export default class UploadFileToContainerCommand extends Command{
  elRef: any;
  emailHTML: SafeHtml = '';
  rawEmailHTML: string = '';
  sanitizer: any;

  constructor(
    private mediator: EditorMediator,
    private event: Event,
    private selector: string,
    private emailService: EmailService,

  ){
    super()
  }

  override execute(): void {
    debugger;
    this.uploadImagem(this.event, this.selector); 
  }


    async uploadImagem(event: any, type: string) {
      debugger;
      this.mediator.saveCurrentEditorState(); // Salvar o estado antes de fazer a alteração

    const element = this.event.currentTarget as HTMLInputElement
    const file = element.files![0]
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.createElement('img');
        const selector = `[data-replaceable-image-${type}]`;
        // Seleciona o container específico onde a imagem será inserida
        const container = document.querySelector(selector) as HTMLImageElement;

        img.src = e.target.result;
        img.style.height = 'auto';

        img.draggable = true;
        img.ondragstart = (ev: DragEvent) => {
          ev.dataTransfer?.setData('text/plain', img.src);
        };

        

        if (container) {
          container.src = img.src; // Atualiza o atributo src do elemento img no container específico
          container.style.width = img.style.width; // Atualiza o estilo width do elemento img no container específico
          container.style.height = img.style.height; // Atualiza o estilo height do elemento img no container específico
          container.style.display = img.style.display; // Atualiza o estilo display do elemento img no container específico
          this.mediator.saveCurrentEditorState()
        }

        this.uploadImage(file, type);
      };

      reader.readAsDataURL(file);
    }
  }

  
  // Método que faz o upload da imagem para o servidor e atualiza o caminho da imagem no HTML
  private uploadImage(file: File, type: string): void {
    debugger;
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name); // Adiciona o arquivo ao FormData

      const imageName = file.name; // Captura o nome do arquivo

      // Chama a API para fazer o upload da imagem
      this.emailService.uploadImageToApi(formData, imageName).subscribe(
        (response) => {
          // URL da imagem carregada
          const uploadedImagePath = `https://vivoid.vivo.com.br/creatorPlay/${response.imageName}`;
          debugger;
          // Atualiza o HTML com a URL correta da imagem
          this.updateImageInHtml(type, uploadedImagePath);
        },
        (error) => {
          console.error('Erro ao enviar imagem:', error);
        }
      );
    }
  }

  // Atualiza o HTML substituindo a imagem correspondente
  private updateImageInHtml(type: string, uploadedImagePath: string) {
    const selector = `[data-replaceable-image-${type}]`;
    const container = document.querySelector(selector) as HTMLImageElement;

    if (container) {
      container.src = uploadedImagePath; 

    }

    // Atualiza o HTML geral do email após a substituição da imagem
    this.updateEmailHTML();
  }

  // Atualiza o HTML completo do email
  updateEmailHTML() {
    const headerHTML =
      this.elRef.nativeElement.querySelector('#header-container')?.innerHTML ||
      '';
    const contentHTML =
      this.elRef.nativeElement.querySelector('#content-container')?.innerHTML ||
      '';
    const footerHTML =
      this.elRef.nativeElement.querySelector('#footer-container')?.innerHTML ||
      '';

    // Combina os conteúdos do header, content e footer
    this.rawEmailHTML = `${headerHTML}${contentHTML}${footerHTML}`;
    this.emailHTML = this.sanitizer.bypassSecurityTrustHtml(this.rawEmailHTML);
  }
}
