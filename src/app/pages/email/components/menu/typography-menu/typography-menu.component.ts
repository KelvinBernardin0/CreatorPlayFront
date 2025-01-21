import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';
import { EmailComponent } from '../../../email.component';

@Component({
  selector: 'app-typography-menu',
  templateUrl: './typography-menu.component.html',
  styleUrls: ['./typography-menu.component.css']
})
export class TypographyMenuComponent extends PropertiesMenu {
  @Input() override mediator!: EditorMediator;

  textoEditado: string = ''; // Texto que será editado
  footerHTML!: string;
  headerHTML!: string;

  elementoClicado: HTMLElement | null = null; // Variável para armazenar o elemento clicado

  constructor(http: HttpClient) {
    super(http);
  }

  // Modifica o conteúdo com o texto editado
// Aplica o texto editado ao componente pai
aplicarTextoEditado() {
  if (this.mediator instanceof EmailComponent) {
    this.mediator.aplicarTextoNoContent(this.textoEditado); // Chama o método no EmailComponent
  }
}

  // Função para capturar o texto ao clicar no bloco de texto
  selecionarBlocoTexto(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('bloco-texto')) {
      this.elementoClicado = target;
      this.textoEditado = target.innerHTML; // Captura o texto atual do bloco
    }
  }

  openTextEditor(texto: string): void {
    this.textoEditado = texto; // Define o texto no editor
    // Adicione lógica adicional para exibir o editor, se necessário
    console.log('Texto configurado no editor:', texto);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  
  
}
