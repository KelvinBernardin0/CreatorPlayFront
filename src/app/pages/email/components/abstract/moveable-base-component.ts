
export type Position={
  top: number;
  left: number;
  width: number;
  height: number;
};

export abstract class MovableBaseComponent {
  top: number = 0;
  left: number = 0;
  width: number = 0;
  height: number = 0;
  show: boolean = false;
  innerElement: Element | null = null;

  displayComponentAt(elementPosition: Position): void {
    this.top = elementPosition.top;
    this.left = elementPosition.left;
    this.width = elementPosition.width;
    this.height = elementPosition.height;
    this.show = true;
  }

  displayComponentOn(element: Element): void {
    if (element === this.innerElement) return;

    this.innerElement = element;
    const bodyPosition = document.body.getBoundingClientRect();
    const elementPosition = this.innerElement.getBoundingClientRect();
    this.top = elementPosition.top - bodyPosition.top;
    this.left = elementPosition.left - bodyPosition.left;
    this.width = elementPosition.width;
    this.height = elementPosition.height;
    this.show = true;
  }

  hide(): void {
    this.innerElement = null;
    this.show = false;
  }
}
