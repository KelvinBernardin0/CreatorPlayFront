import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NamedValue } from 'src/app/common/types/NamedValue';
import { TemplateOptions } from 'src/app/common/types/TemplateOptions';
import { EmailService } from 'src/app/services/email/email.service';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { TemplateService } from 'src/app/services/template/template.service';
import { EditableField } from '../../../../../common/types/EditableField';
import { coresFundo } from '../../../data/cor-fundo';
import { esquemaCores } from '../../../data/esquema-cores';
import { footers } from '../../../data/footers';
import { headers } from '../../../data/headers';
import { logos } from '../../../data/logos';
import { modelos } from '../../../data/modelos';
import Command from '../../../patterns/command/command';
import { ChangeDisplayElementCommand } from '../../../patterns/command/display/change-element-display-command';
import { DownloadHtmlCommand } from '../../../patterns/command/download/download_html_command';
import UploadFileToContainerCommand from '../../../patterns/command/file/upload-file-to-container-command';
import { InsertLinkToElementCommand } from '../../../patterns/command/link/insert-link-to-element-command';
import { EditTextContentCommand } from '../../../patterns/command/text/edit-text-content-command';
import { EditorMediator } from '../../../patterns/mediator/editor_mediator';
import { copyWith } from '../../../patterns/prototype/copywith';
import { PropertyState } from '../../../patterns/state/propertie-state';
import { blocks, NamedPathState } from '../../../patterns/state/state-array';
import { SelectionInputComponent } from '../../input/selection-input/selection-input.component';
import DragCopyEndCommand from '../../../patterns/command/drag/drag-copy-end-command';
import DragCopyStartCommand from '../../../patterns/command/drag/drag-copy-start-command';
import { NamedPath } from 'src/app/common/types/NamedPath';
import { NamedHtml } from 'src/app/common/types/NamedHtml';
import { planos } from '../../../data/planos';
@Component({
  selector: 'app-building-blocks-menu',
  templateUrl: './building-blocks-menu.component.html',
  styleUrls: ['./building-blocks-menu.component.css'],
})
export class BuildingBlocksMenuComponent {
  constructor(
    private http: HttpClient,
    private notificacaoService: NotificacaoService,
    private templateService: TemplateService,
    private elRef: ElementRef,
    private router: Router,
    private emailService: EmailService
  ) {}
  @Input() mediator!: EditorMediator;
  private parser: DOMParser = new DOMParser();

  protected selectedColorScheme: NamedValue<boolean> = esquemaCores.find(
    (e) => e.value === false
  )!;

  draggedBlock: any;

  protected selectedHeaderOption: NamedValue<TemplateOptions> | null = null;
  protected selectedFooterOption: NamedValue<TemplateOptions> | null = null;

  protected opcoesModeloEstrutura: NamedValue<string>[] = modelos;
  protected opcoesCorFundo: NamedValue<string>[] = coresFundo;
  protected opcoesEsquemaCor: NamedValue<boolean>[] = esquemaCores;
  protected opcoesFooters: NamedValue<TemplateOptions>[] = footers;
  protected opcoesModeloHeader: NamedValue<TemplateOptions>[] = headers;
  protected opcoesLogo: NamedValue<string>[] = logos;

  protected blocks: NamedPathState[] = blocks;
  protected state: PropertyState = 'Vazio';

  protected mostrarSeletorImagem: boolean = false;
  private _mostrarPreTitulo: boolean = false;
  private _mostrarSubtitulo: boolean = false;
  private _mostrarTextoLegal: boolean = false;
  private _mostrarBotao: boolean = false;

  private _titulo: string = '';
  private _preTitulo: string = '';
  private _subTitulo: string = '';
  private _botao: string = '';
  private _linkBotao: string = '';

  private _textoLegal: string = '';
  protected opcoesVitrinePlanos: NamedHtml[] = [];
  @ViewChild('selectionInputHeader')
  selectionInputHeader!: SelectionInputComponent<TemplateOptions>;
  @ViewChild('selectionInputFooter')
  selectionInputFooter!: SelectionInputComponent<TemplateOptions>;

  ngOnInit(): void {
    this.getAndPushData(planos[0], this.opcoesVitrinePlanos)
    this.onChangeColorScheme({
      name: 'Padrão',
      value: false,
    });

  }

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

  get titulo() {
    return this._titulo;
  }
  get preTitulo() {
    return this._preTitulo;
  }
  get subTitulo() {
    return this._subTitulo;
  }

  set preTitulo(value: string) {
    this._preTitulo = value;
    this.editElement('#editable-pretitle', value);
  }

  set titulo(value: string) {
    this._titulo = value;
    this.editElement('#editable-title', value);
  }

  set subTitulo(value: string) {
    this._subTitulo = value;
    this.editElement('#editable-subtitle', value);
  }

  get textoLegal(): string {
    return this._textoLegal;
  }
  set textoLegal(value: string) {
    this._textoLegal = value;
    this.editElement('#legal-text', value);
  }

  get botao(): string {
    return this._botao;
  }

  set botao(value: string) {
    this._botao = value;
    this.editElement('#editable-button', value);
  }

  get linkBotao(): string {
    return this._linkBotao;
  }

  set linkBotao(value: string) {
    this._linkBotao = value;
    const command = new InsertLinkToElementCommand({
      mediator: this.mediator,
      link: value,
      targetSelector: '#editable-button',
    });
    this.mediator.executeCommand(command);
  }

  protected changeState(newState: PropertyState) {


    this.state = newState;
    this.mediator.changePropertiesState(this.state);
  }



   dragCopyEnd(event: DragEvent) {
      const command = new DragCopyEndCommand(this.mediator, event)
      this.mediator.executeCommand(command)
    }

    dragCopyStart(event: DragEvent, data: PropertyState) {
      let command:Command;
        switch (data) {
          case 'Planos':
            command = new DragCopyStartCommand(this.mediator, event, this.opcoesVitrinePlanos[0].html)
            break;
          default:
            command = new DragCopyStartCommand(this.mediator, event, data)
            break;
        }


      this.mediator.executeCommand(command)
      this.changeState(data);
    }


  protected getAndPushData(opcao: NamedPath, opcoes: NamedHtml[]): void{
    this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
      
      opcoes.push({ nome: opcao.nome, html: data });
    });
  }




  protected changeBackgroundColor(namedValue: NamedValue<string>) {
    const color = namedValue.value;
    this.mediator.changeBackgroundColor(color);
  }

  protected editElement(selector: string, text: string) {
    const commands = [
      new EditTextContentCommand({
        mediator: this.mediator,
        selector: selector,
        text: text,
      }),
    ];
    this.mediator.executeCommands(commands);
  }

  protected toogleElement(selector: string, value: boolean) {
    const command = new ChangeDisplayElementCommand({
      mediator: this.mediator,
      display: value,
      selector: selector,
    });
    this.mediator.executeCommand(command);
  }

  protected downloadHtml(templateStatus: number): void {
    const command = new DownloadHtmlCommand(
      { templateStatus, mediator: this.mediator },
      this.notificacaoService,
      this.templateService,
      this.elRef,
      this.router
    );
    this.mediator.executeCommand(command);
  }

  protected async onChangeHeader(selectedOption: NamedValue<TemplateOptions>) {
    const { url, hasImage } = selectedOption.value;

    this.mostrarSeletorImagem = hasImage;

    const result = await firstValueFrom(
      this.http.get(url, { responseType: 'text' })
    );

    const html = this.parser.parseFromString(result, 'text/html');

    this.executeHeadersCommands(html);
    const currentState = this.mediator.getCurrentEditorState();
    const newState = copyWith(currentState, {
      header: html.documentElement.outerHTML,
    });
    this.mediator.updateEditorState(newState);
    this.mediator.hideHoverBorder();
  }

  private executeHeadersCommands(html: Document) {
    const changeDisplayGenerators: EditableField[] = [
      {
        display: this.mostrarPreTitulo,
        selector: '#editable-pretitle',
        value: this.preTitulo,
      },
      {
        display: this.mostrarSubtitulo,
        selector: '#editable-subtitle',
        value: this.preTitulo,
      },
      {
        display: this.mostrarBotao,
        selector: '#editable-button',
        value: this.botao,
      },
    ];

    const editTextGenerator: EditableField[] = [
      ...changeDisplayGenerators,
      { display: true, selector: '#editable-title', value: this.titulo },
    ];

    const commands: Command[] = [
      ...changeDisplayGenerators.map(
        (e) =>
          new ChangeDisplayElementCommand({
            mediator: this.mediator,
            display: e.display,
            selector: e.selector,
            target: html,
          })
      ),
      ...editTextGenerator
        .filter((e) => e.value !== '')
        .map(
          (e) =>
            new EditTextContentCommand({
              mediator: this.mediator,
              selector: e.selector,
              text: e.value,
              target: html,
            })
        ),
      new InsertLinkToElementCommand({
        mediator: this.mediator,
        link: this.linkBotao,
        targetSelector: '#editable-button',
        target: html,
      }),
    ];

    this.mediator.executeCommands(commands);
  }

  protected async onChangeFooter(namedValue: NamedValue<TemplateOptions>) {
    const { url } = namedValue.value;
    const result = await firstValueFrom(
      this.http.get(url, { responseType: 'text' })
    );

    const html = this.parser.parseFromString(result, 'text/html');
    this.executeFootersCommands(html);

    const currentState = this.mediator.getCurrentEditorState();
    const newState = copyWith(currentState, {
      footer: html.documentElement.outerHTML,
    });
    this.mediator.updateEditorState(newState);
    // this.resetFooterOptions();
    this.mediator.hideHoverBorder();
  }

  protected executeFootersCommands(html: Document) {
    const selector = '#legal-text';
    const commands: Command[] = [
      new ChangeDisplayElementCommand({
        display: this.mostrarTextoLegal,
        mediator: this.mediator,
        selector: selector,
        target: html,
      }),
    ];
    if (this.textoLegal !== '') {
      commands.push(
        new EditTextContentCommand({
          mediator: this.mediator,
          selector: selector,
          text: this.textoLegal,
          target: html,
        })
      );
    }
    this.mediator.executeCommands(commands);
  }

  protected uploadImageHeader(event: Event, local: string) {


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

  protected onChangeColorScheme(namedValue: NamedValue<boolean>) {
    const filterOptions = (
      options: NamedValue<TemplateOptions>[],
      isInverse: boolean
    ) => options.filter((e) => e.value.isInverse === isInverse);

    const filteredHeaderOptions = filterOptions(headers, namedValue.value);
    const filteredFooterOptions = filterOptions(footers, namedValue.value);

    this.opcoesFooters = filteredFooterOptions;
    this.opcoesModeloHeader = filteredHeaderOptions;

    const firstHeaderOption = filteredHeaderOptions.at(0)!;
    const firstFooterOption = filteredFooterOptions.at(0)!;

    this.selectionInputHeader.changeSelectionTo(firstHeaderOption);
    this.onChangeFooter(firstFooterOption);
  }
}
