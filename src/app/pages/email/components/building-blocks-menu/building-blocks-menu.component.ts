import { Component } from '@angular/core';
import {headers} from '../../data/headers';


@Component({
  selector: 'app-building-blocks-menu',
  templateUrl: './building-blocks-menu.component.html',
  styleUrls: ['./building-blocks-menu.component.css']
})
export class BuildingBlocksMenuComponent {
  protected opcoesModeloEstrutura: string[] = ['B2B', 'B2C']
  protected opcoesCorFundo: string[] = ['Branco', 'Cinza', 'Púrpura']
  protected opcoesEsquemaCor: string[] = ['Padrão', 'Inverso']
  protected opcoesModeloHeader: string[] = headers.map((item) => item.nome)
  protected opcoesLogo: string[] = ['Valoriza Empresas', 'Seguros', 'Saúde', 'Agro']


  protected onChange: () => void = () => console.log('changed')

}
