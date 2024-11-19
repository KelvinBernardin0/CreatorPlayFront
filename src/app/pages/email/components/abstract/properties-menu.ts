import {HttpClient} from "@angular/common/http";
import {NamedHtml} from "src/app/common/types/NamedHtml";
import {NamedPath} from "src/app/common/types/NamedPath";

export default abstract class PropertiesMenu {
  constructor(
    private http: HttpClient
  ){}

  getAndPushData(opcao: NamedPath, opcoes: NamedHtml[]): void{
    this.http.get(opcao.path, { responseType: 'text' }).subscribe((data) => {
      opcoes.push({ nome: opcao.nome, html: data });
    });
  }

}
