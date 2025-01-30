import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import { cards } from '../../../data/cards';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import { EmailService } from 'src/app/services/email/email.service';
import { InsertLinkToElementCommand } from '../../../patterns/command/link/insert-link-to-element-command';

@Component({
  selector: 'app-cards-menu',
  templateUrl: './cards-menu.component.html',
  styleUrls: ['./cards-menu.component.css'],
})
export class CardsMenuComponent
  extends PropertiesMenu
  implements AfterViewInit
{
  @Input() override mediator!: EditorMediator;

  opcoesCards: NamedHtml[] = [];
  termosDeUsoAceitos: boolean = false;
  linkCard: string = '';

  constructor(http: HttpClient, private emailService: EmailService) {
    super(http);
  }

  ngAfterViewInit(): void {
    cards.forEach((opcao) => this.getAndPushData(opcao, this.opcoesCards));
  }

  uploadFileCard(event: Event, local: string) {
    const command = new UploadFileToContainerCommand(
      this.mediator,
      event,
      local, // Passando o valor correto de 'header' ou 'local'
      this.emailService
    );
    this.mediator.executeCommand(command);
    // this.uploadFileToContainer('[data-replaceable-image-card]', event);
  }

  changeColorContent(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (!selectedValue) return;

    const contentElement = document.querySelector(
      '#tableCard'
    ) as HTMLDivElement;

    switch (selectedValue) {
      case 'branco':
        contentElement.style.border = '';
        contentElement.style.borderCollapse = 'initial';
        contentElement.style.backgroundColor = '#ffffff';
        break;
      case 'cinza':
        contentElement.style.border = '1px solid #DDDDDD';
        contentElement.style.borderCollapse = 'separate';
        contentElement.style.backgroundColor = '#f6f6f6';
        break;
    }
  }

  onLinkCardChange(newLink: string) {
    const targetSelector = '#btnCard'; // Substitua pelo seletor do elemento alvo
    const command = new InsertLinkToElementCommand({
      mediator: this.mediator,
      link: newLink,
      targetSelector: targetSelector,
    });
    command.execute();
  }
}
