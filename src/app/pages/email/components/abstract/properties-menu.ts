import {HttpClient} from "@angular/common/http";
import {NamedHtml} from "src/app/common/types/NamedHtml";
import {NamedPath} from "src/app/common/types/NamedPath";
import {EditorMediator} from "../../patterns/mediator/editor_mediator";
import DragCopyEndCommand from "../../patterns/command/drag/drag-copy-end-command";
import DragCopyStartCommand from "../../patterns/command/drag/drag-copy-start-command";

export default abstract class PropertiesMenu {
  protected mediator!: EditorMediator
  constructor(
    private http: HttpClient,
  ){}

  protected getAndPushData(opcao: NamedPath, opcoes: NamedHtml[]): void{
    this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
      opcoes.push({ nome: opcao.nome, html: data });
    });
  }

  dragCopyEnd(event: DragEvent) {
    const command = new DragCopyEndCommand(this.mediator, event)
    this.mediator.executeCommand(command)
  }
  dragCopyStart(event: DragEvent, data: string) {
    const command = new DragCopyStartCommand(this.mediator, event, data)
    this.mediator.executeCommand(command)
  }

}
