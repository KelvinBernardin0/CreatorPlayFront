import { PropertyState } from './../../../patterns/state/propertie-state';
import { AfterViewInit, Component, Input } from '@angular/core';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import PropertiesMenu from '../../abstract/properties-menu';
import {equipamentos} from '../../../data/equipamentos';
import {HttpClient} from '@angular/common/http';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import {InsertLinkToImageCommand} from '../../../patterns/command/link/insert-link-to-image-command';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-vitrine-menu',
  templateUrl: './vitrine-menu.component.html',
  styleUrls: ['./vitrine-menu.component.css'],
})
export class VitrineMenuComponent extends PropertiesMenu implements AfterViewInit{
  @Input() override mediator!: EditorMediator;

  protected termosDeUsoAceitos: boolean = false;


  constructor(
    http: HttpClient, private emailService: EmailService
  ){
    super(http)
  }

  protected opcoesVitrineEquipamento: NamedHtml[] = [];

  ngAfterViewInit(): void {
    equipamentos.forEach((opcao) => this.getAndPushData(opcao, this.opcoesVitrineEquipamento));
  }

  uploadFileVitrine1(event: Event, local: string) {
    const command = new UploadFileToContainerCommand(
      this.mediator,
      event,
      local, // Passando o valor correto de 'header' ou 'local'
      this.emailService
    );
    this.mediator.executeCommand(command);
  }

  uploadFileVitrine2(event: Event, local: string) {
    const command = new UploadFileToContainerCommand(
      this.mediator,
      event,
      local, // Passando o valor correto de 'header' ou 'local'
      this.emailService
    );
    this.mediator.executeCommand(command);
  }

  inserirLink(){
    const command = new InsertLinkToImageCommand(this.mediator)
    this.mediator.executeCommand(command)
  }
}
