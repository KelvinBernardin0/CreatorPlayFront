import Command from '../command';

export class SmoothScroolCommand extends Command {
  constructor(private selector: string) {
    super();
  }

  override execute(): void {
    const element = document.querySelector(this.selector) as HTMLElement
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
