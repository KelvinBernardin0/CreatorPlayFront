import {Component,Input} from '@angular/core';
import {headers} from '../../../data/headers';
import {EditorMediator} from '../../../patterns/mediator/editor_mediator';
import {blocks, NamedPathState} from '../../../patterns/state/state-array';
import {PropertyState} from '../../../patterns/state/propertie-state';

@Component({
  selector: 'app-building-blocks-menu',
  templateUrl: './building-blocks-menu.component.html',
  styleUrls: ['./building-blocks-menu.component.css'],
})
export class BuildingBlocksMenuComponent {

  @Input() mediator!: EditorMediator

  protected opcoesModeloEstrutura: string[] = ['B2B', 'B2C'];
  protected opcoesCorFundo: string[] = ['Branco', 'Cinza', 'Púrpura'];
  protected opcoesEsquemaCor: string[] = ['Padrão', 'Inverso'];
  protected opcoesModeloHeader: string[] = headers.map((item) => item.nome);
  protected opcoesLogo: string[] = [
    'Valoriza Empresas',
    'Seguros',
    'Saúde',
    'Agro',
  ];

  protected mostrarPreTitulo: boolean=false
  protected mostrarSubTitulo: boolean=false
  protected mostrarBotao: boolean=false
  protected mostrarTextoLegal: boolean=false

  protected onChange: () => void = () => console.log('changed');

  protected blocks: NamedPathState[] = blocks
  protected state: PropertyState = 'Vazio'

  protected changeState(newState: PropertyState){
    this.state = newState

    this.mediator.changePropertiesState(this.state)
  }

}
