import { Position } from './Position';

export abstract class MovableBaseComponent {
  top: number = 0;
  left: number = 0;
  width: number = 0;
  height: number = 0;
  show: boolean = false;
  htmlElememnt: HTMLElement | null = null;

  displayComponentAt(elementPosition: Position): void {
    this.top = elementPosition.top;
    this.left = elementPosition.left;
    this.width = elementPosition.width;
    this.height = elementPosition.height;
    this.show = true;
  }

  displayComponentOn(element: HTMLElement): void {
    if (element === this.htmlElememnt) return;

    this.htmlElememnt = element;
    const bodyPosition = document.body.getBoundingClientRect();
    const elementPosition = this.htmlElememnt.getBoundingClientRect();
    this.top = elementPosition.top - bodyPosition.top;
    this.left = elementPosition.left - bodyPosition.left;
    this.width = elementPosition.width;
    this.height = elementPosition.height;
    this.show = true;
  }

  hide(): void {
    this.htmlElememnt = null;
    this.show = false;
  }
}
