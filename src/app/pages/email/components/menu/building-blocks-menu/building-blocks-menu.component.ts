import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  NamedValue,
  NamedValueWithImage,
} from 'src/app/common/types/NamedValue';
import { coresFundo } from '../../../data/cor-fundo';
import { footers } from '../../../data/footers';
import { headers } from '../../../data/headers';
import { logos } from '../../../data/logos';
import { modelos } from '../../../data/modelos';
import Command from '../../../patterns/command/command';
import { ChangeDisplayElementCommand } from '../../../patterns/command/display/change-element-display-command';
import { DownloadHtmlCommand } from '../../../patterns/command/download/download_html_command';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import { SmoothScroolCommand } from '../../../patterns/command/scroll/smooth_scroll_command';
import { EditTextContentCommand } from '../../../patterns/command/text/edit-text-content-command';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { copyWith } from '../../../patterns/prototype/copywith';
import { PropertyState } from '../../../patterns/state/propertie-state';
import { blocks, NamedPathState } from '../../../patterns/state/state-array';
import { InsertLinkToElementCommand } from '../../../patterns/command/link/insert-link-to-element-command';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { TemplateService } from 'src/app/services/template/template.service';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-building-blocks-menu',
  templateUrl: './building-blocks-menu.component.html',
  styleUrls: ['./building-blocks-menu.component.css'],
})
export class BuildingBlocksMenuComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private notificacaoService: NotificacaoService,
    private templateService: TemplateService,
    private elRef: ElementRef,
    private router: Router,
    private emailService: EmailService

  ) {}

  @Input() mediator!: EditorMediator;

  protected opcoesModeloEstrutura: NamedValue<string>[] = modelos;
  protected opcoesCorFundo: NamedValue<string>[] = coresFundo;
  protected opcoesFooters: NamedValue<string>[] = footers;
  protected opcoesModeloHeader: NamedValueWithImage<string>[] = headers;
  protected opcoesLogo: NamedValue<string>[] = logos;
  protected selectedHeaderModel!: NamedValueWithImage<string>;

  protected blocks: NamedPathState[] = blocks;
  protected state: PropertyState = 'Vazio';

  protected mostrarSeletorImagem: boolean = false;
  private _mostrarPreTitulo: boolean = false;
  private _mostrarSubtitulo: boolean = false;
  private _mostrarTextoLegal: boolean = false;
  private _mostrarBotao: boolean = false;

  get mostrarBotao(): boolean {
    return this._mostrarBotao;
  }

  set mostrarBotao(value: boolean) {
    this._mostrarBotao = value;
    this.toogleElement('#editable-button', value);
  }

  get mostrarPreTitulo(): boolean {
    return this._mostrarPreTitulo;
  }
  set mostrarPreTitulo(value: boolean) {
    this._mostrarPreTitulo = value;
    this.toogleElement('#editable-pretitle', value);
  }

  get mostrarSubtitulo(): boolean {
    return this._mostrarSubtitulo;
  }

  set mostrarSubtitulo(value: boolean) {
    this._mostrarSubtitulo = value;
    this.toogleElement('#editable-subtitle', value);
  }

  get mostrarTextoLegal(): boolean {
    return this._mostrarTextoLegal;
  }

  set mostrarTextoLegal(value: boolean) {
    this._mostrarTextoLegal = value;
    this.toogleElement('#legal-text', value);
  }

  protected changeState(newState: PropertyState) {
    this.state = newState;
    this.mediator.changePropertiesState(this.state);
  }

  protected changeBackgroundColor(event: Event) {
    const color = (event.target as HTMLSelectElement).value;
    this.mediator.changeBackgroundColor(color);
  }

  protected onPretitleChange(event: Event) {
    this.editElement('#editable-pretitle', event);
  }

  protected onTitleChange(event: Event) {
    this.editElement('#editable-title', event);
  }

  protected onSubtitleChange(event: Event) {
    this.editElement('#editable-subtitle', event);
  }

  protected onLegalTextChange(event: Event) {
    this.editElement('#legal-text', event);
  }

  protected editElement(selector: string, event: Event) {
    const text: string = (event.target as HTMLInputElement).value;
    const commands = [
      new EditTextContentCommand({
        mediator: this.mediator,
        selector: selector,
        text: text,
      }),
      new SmoothScroolCommand(selector),
    ];
    this.mediator.executeCommands(commands);
  }

  protected toogleElement(selector: string, value: boolean) {
    const element = document.querySelector(selector) as HTMLElement;
    const command = new ChangeDisplayElementCommand({
      mediator: this.mediator,
      element: element,
      display: value,
    });
    this.mediator.executeCommand(command);
  }

  protected downloadHtml(templateStatus: number): void {
    const command = new DownloadHtmlCommand(
      { templateStatus, mediator: this.mediator },
      this.notificacaoService,  // Pass the service separately
      this.templateService,     // Pass the service separately
      this.elRef,               // Pass the reference separately
      this.router               // Pass the router separately
    );
    this.mediator.executeCommand(command);
  }
  

 

  protected async changeHeader(event: Event) {
    this.mediator.saveCurrentEditorState();
    const currentState = this.mediator.getCurrentEditorState();
    const element = event.target as HTMLSelectElement;
    const selectedElement = this.opcoesModeloHeader.find(
      (e) => e.value === element.value
    );
    this.mostrarSeletorImagem = selectedElement!.hasImage;

    const url = element.value;
    const result = await firstValueFrom(
      this.http.get(url, { responseType: 'text' })
    );

    const newState = copyWith(currentState, { header: result });
    this.mediator.updateEditorState(newState);
  }

  protected async changeFooter(event: Event) {
    this.mediator.saveCurrentEditorState();
    const currentState = this.mediator.getCurrentEditorState();
    const url = (event.target as HTMLSelectElement).value;
    const result = await firstValueFrom(
      this.http.get(url, { responseType: 'text' })
    );

    const newState = copyWith(currentState, { footer: result });
    this.mediator.updateEditorState(newState);
  }

  protected onButtonChange(event: Event) {
    this.editElement('#editable-button', event);
  }

  protected uploadImageHeader(event: Event, local: string) {
   debugger;
    
    const command = new UploadFileToContainerCommand(
      this.mediator, 
      event, 
      local, // Passando o valor correto de 'header' ou 'local'
      this.emailService
    );
    this.mediator.executeCommand(command);
  }
  
  
  

  protected onChange() {
    throw new Error('Method not implemented.');
  }

  protected onLinkChange(event: Event): void {
    const text: string = (event.target as HTMLInputElement).value;
    const command = new InsertLinkToElementCommand({
      mediator: this.mediator,
      link: text,
      targetSelector: '#editable-button',
    });
    this.mediator.executeCommand(command);
  }
}
