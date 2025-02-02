import { PropertyState } from './../../../patterns/state/propertie-state';
import { AfterViewInit, Component,ElementRef, Input } from '@angular/core';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import PropertiesMenu from '../../abstract/properties-menu';
import {equipamentos} from '../../../data/equipamentos';
import {HttpClient} from '@angular/common/http';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import {InsertLinkToImageCommand} from '../../../patterns/command/link/insert-link-to-image-command';
import { EmailService } from 'src/app/services/email/email.service';
import { InsertLinkToElementCommand } from '../../../patterns/command/link/insert-link-to-element-command';

@Component({
  selector: 'app-vitrine-menu',
  templateUrl: './vitrine-menu.component.html',
  styleUrls: ['./vitrine-menu.component.css'],
})
export class VitrineMenuComponent extends PropertiesMenu implements AfterViewInit{
  @Input() override mediator!: EditorMediator;

  protected termosDeUsoAceitos: boolean = false;


  constructor(
    http: HttpClient,
   private emailService: EmailService,
   private elRef: ElementRef
  ){
    super(http)
  }

  protected opcoesVitrineEquipamento: NamedHtml[] = [];

  ngAfterViewInit(): void {
    equipamentos.forEach((opcao) => this.getAndPushData(opcao, this.opcoesVitrineEquipamento));
  }
  selecaoEquipamento(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const equipamento = selectElement.value;
    const opcao = this.opcoesVitrineEquipamento.find(opcao => opcao.nome === equipamento);
    if (opcao) {
      this.updateHtml(opcao.html);
    }
  }
  updateHtml(html: string): void {
    const container = document.getElementById('equipamentoContainer');
    if (container) {
      container.innerHTML = html;
    }
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
    const linkInput = this.elRef.nativeElement.querySelector('#link-input');
    const newLink = linkInput ? linkInput.value : '';
    const targetSelector = '#equipamentoContainer';
    const command = new InsertLinkToElementCommand({
      mediator: this.mediator,
      link: newLink,
      targetSelector: targetSelector,
    });
    command.execute();
  }
  enableTermosDeUso(): void {
    this.termosDeUsoAceitos = true;
  }
}
