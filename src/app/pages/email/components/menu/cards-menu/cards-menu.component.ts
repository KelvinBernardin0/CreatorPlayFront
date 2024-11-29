import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import { cards } from '../../../data/cards';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';
import DragCopyStartCommand from '../../../patterns/command/drag/drag-copy-start-command';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import PropertiesMenu from '../../abstract/properties-menu';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import {InsertLinkToImageCommand} from '../../../patterns/command/link/insert-link-to-image-command';
import { EmailService } from 'src/app/services/email/email.service';

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

  constructor(http: HttpClient,
    private emailService: EmailService,

  ) {
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
    );    this.mediator.executeCommand(command);
    // this.uploadFileToContainer('[data-replaceable-image-card]', event);
  }

 

  inserirLink(){
    const command = new InsertLinkToImageCommand(this.mediator)
    this.mediator.executeCommand(command)
  }
}
