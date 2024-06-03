import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class GlobalConstants {
  //public static apiURL: string = "https://localhost:7232";
  public static apiURL: string = environment.apiURL;
  //public static apiURL: string = "https://book2.simplifiquevivoemp.com.br";

  //"https://localhost:7232";

  //10.243.253.18:8084	 -- FRONTEND - não estamos usando !
  //10.243.253.18:8083	   --FRONTEND

  //10.243.252.168 -

  // 10.237.169.76	 -- BACKEND DE DEV
  //10.237.169.74	   --BACKEND PARA HOMOLOGAÇÃO

  //74 e 75 FRONTEND -- 200.229.196.163
  //76 e 77 BACKEND

  public static minutesToken: number = 60;

  public static headersGet = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  public static headersPostNoAuth = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'No-Auth': 'True',
  });
  public static headersPost = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
}

export class GlobalFunctions {
  static RetornaIcone(status: string): string {
    switch (status) {
      //ICONE AZUL - OK
      case 'Aberto':
      case 'Aprovado Crédito':
      case 'Aprovado Fraude':
      case 'Aberto':
      case 'OK Input Automático':
        return '/assets/imgs/h_ok_azul_redondo.svg';

      //ICONE VERDE - OK
      case 'Aprovado':
      case 'Concluído':
      case 'Concluído Aprovação':
        return '/assets/imgs/h_ok_verde_redondo.svg';

      //ICONE LARANJA - ATENÇÃO
      case 'Em Aprovação':
      case 'Expirado':
      case 'Expirado por prevenção a fraude':
        return '/assets/imgs/h_atencao-redondo.svg';

      //ICONE LARANJA - PAUSE
      case 'Aguardando Crédito':
      case 'Aguardando Críticas':
      case 'Aguardando Fraude':
      case 'Aguardando Input Automático':
      case 'Aguardando Ofertas':
      case 'SAV - Aguardando Censup':
      case 'SAV - Aguardando chamado TI':
      case 'SAV - Aguardando Equipe de ofertas':
      case 'SAV - Aguardando Produtos':
      case 'Suporte a Vendas':
      case 'Termo Gerado':
      case 'Tramitação Social Wifi / VGR':
      case 'SAV - Em Análise':
      case 'Contrato Assinado':
        return '/assets/imgs/h_pause_laranja_redondo.svg';

      //ICONE VERMELHO - ERRO
      case 'Reprovado Alçada':
      case 'Reprovado Crédito':
      case 'Reprovado Fraude':
      case 'Cancelado':
      case 'Negado Crédito':
      case 'Negado Fraude':
      case 'Reprovado Suporte a Vendas':
      case 'Erro Input Automático':
      case 'SAV - Reprovado':
        return '/assets/imgs/h_erro_redondo.svg';

      default:
        return ''; //AVALIAR O NOVO ICONE CINZA
    }
  }
  static DeterminaCor(indice: number): string {
    switch (indice) {
      case 0:
        return 'd-flex align-items-center sf-border-color-b-rosa sf-margin-b-10';
      case 1:
        return 'd-flex align-items-center sf-border-color-b-roxo sf-margin-b-10';
      case 2:
        return 'd-flex align-items-center sf-border-color-b-verde sf-margin-b-10';
      case 3:
        return 'd-flex align-items-center sf-border-color-b-laranja sf-margin-b-10';
      default:
        return 'd-flex align-items-center sf-border-color-b-azul sf-margin-b-10';
    }
  }
  static DeterminaGrafico(indice: number, borda: boolean): string {
    if (borda) {
      switch (indice) {
        case 0:
          return 'rgb(240, 100, 150)';
        case 1:
          return 'rgb(120, 80, 160)';
        case 2:
          return 'rgb(185, 210, 90)';
        case 3:
          return 'rgb(250, 180, 55)';
        default:
          return 'rgb(0, 170, 220)';
      }
    } else {
      switch (indice) {
        case 0:
          return 'rgb(205, 30, 90)';
        case 1:
          return 'rgb(102, 0, 153)';
        case 2:
          return 'rgb(153, 204, 51)';
        case 3:
          return 'rgb(255, 153, 0)';
        default:
          return 'rgb(0, 102, 204)';
      }
    }
  }
}

//chrome://flags/#allow-insecure-localhost
