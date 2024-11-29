import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import PropertiesMenu from '../../abstract/properties-menu';
import { HttpClient } from '@angular/common/http';
import { planos } from '../../../data/planos';
import DragCopyStartCommand from '../../../patterns/command/drag/drag-copy-start-command';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import { InsertLinkToImageCommand } from '../../../patterns/command/link/insert-link-to-image-command';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-plans-menu',
  templateUrl: './plans-menu.component.html',
  styleUrls: ['./plans-menu.component.css'],
})
export class PlansMenuComponent
  extends PropertiesMenu
  implements AfterViewInit
{
  @Input() override mediator!: EditorMediator;
  protected opcoesVitrinePlanos: NamedHtml[] = [];
  termosDeUsoAceitos: boolean = false;

  constructor(http: HttpClient, private emailService: EmailService) {
    super(http);
  }

  ngAfterViewInit(): void {
    planos.forEach((opcao) =>
      this.getAndPushData(opcao, this.opcoesVitrinePlanos)
    );
  }

  uploadFileCard(event: Event, local: string) {
    const command = new UploadFileToContainerCommand(
      this.mediator,
      event,
      local, // Passando o valor correto de 'header' ou 'local'
      this.emailService
    );
    this.mediator.executeCommand(command);
  }

  inserirLink() {
    const command = new InsertLinkToImageCommand(this.mediator);
    this.mediator.executeCommand(command);
  }
}
