import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';

@Component({
  selector: 'app-typography-menu',
  templateUrl: './typography-menu.component.html',
  styleUrls: ['./typography-menu.component.css']
})
export class TypographyMenuComponent extends PropertiesMenu {
  @Input() override mediator!: EditorMediator;

  textoEditado: string = ''; // Texto que será editado
  elementoClicado: HTMLElement | null = null; // Variável para armazenar o elemento clicado

  constructor(http: HttpClient) {
    super(http);
  }

  // Função para aplicar o texto editado de volta ao elemento clicado
  aplicarTextoEditado() {
    if (this.elementoClicado) {
      this.elementoClicado.innerHTML = this.textoEditado; // Atualiza o conteúdo com o texto editado
    }

    // Rola a página para o topo após a edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Função para capturar o texto ao clicar no bloco de texto
  selecionarBlocoTexto(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('bloco-texto')) {
      this.elementoClicado = target;
      this.textoEditado = target.innerHTML; // Captura o texto atual do bloco
    }
  }
}
