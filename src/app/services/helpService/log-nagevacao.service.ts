import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute,ParamMap, Route } from '@angular/router';
import { AutenticacaoGuard } from 'src/app/common/autenticacao/autenticacao.guard';

@Injectable({
  providedIn: 'root'
})
export class LogNavegacaoService {
  readonly apiURL = GlobalConstants.apiURL;
  readonly headersGet = GlobalConstants.headersGet;
  formData = new FormData();
  ActivatedRouteSnapshot: any;
  RouterStateSnapshot: any;
  constructor(
      private http: HttpClient,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      this.ActivatedRouteSnapshot = next;
      this.RouterStateSnapshot = state;
    let ActivatedRouteSnapshot: any = next.component!;
    let Component = ActivatedRouteSnapshot.name;
    this.PutUsuarioNavegacao(state.url, JSON.stringify(next.params), next.data['title'], Component);
  }

  LogUsuarioNavegacao(nomeComponent: string){


  }
  PutUsuarioNavegacao(Url: string, Parametro: string, Descricao: string, Component: string) {
    this.formData = new FormData();
    this.formData.append('Url', Url);
    this.formData.append('Parametro', Parametro);
    this.formData.append('Descricao', Descricao);
    this.formData.append('Component', Component);
    this.http.post(this.apiURL + '/ApiSeguranca/LogGeral/PutUsuarioNavegacao', this.formData).subscribe((data: any) => {

    },
      (e: Error) => {
        console.log(e)
      });
  }
  PutUsuarioNavegacao_2(formData: FormData) {
    return this.http.post(this.apiURL + '/ApiSeguranca/LogGeral/PutUsuarioNavegacao', formData);
  }

  GetInformacaoNavegador(){
    const agent = window.navigator.userAgent.toLowerCase();
    let userAgent = '';
    switch (true) {
      case agent.indexOf('edge') > -1:
        userAgent = 'Edge';
        break;
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        userAgent = 'Opera';
        break;
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        userAgent = 'Chrome';
        break;
      case agent.indexOf('trident') > -1:
        userAgent = 'Ie';
        break;
      case agent.indexOf('firefox') > -1:
        userAgent = 'Firefox';
        break;
      case agent.indexOf('safari') > -1:
        userAgent = 'Safari';
        break;
      default:
        userAgent = 'other';
    }

    return userAgent
  }

}
