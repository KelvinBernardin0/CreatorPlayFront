import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { GlobalConstants } from '../../common/global-constants';
import { AutenticacaoToken } from './autenticacao.token';
import { LogNavegacaoService } from 'src/app/services/helpService/log-nagevacao.service';
import { LogGeralService } from 'src/app/services/helpService/log-geral.service';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  formData = new FormData();
  constructor(
    private router: Router,
    private autenticacaoToken: AutenticacaoToken,
    private logGeralService: LogGeralService,
    private logNavegacaoService: LogNavegacaoService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.autenticacaoToken.Token()) {
      let ActivatedRouteSnapshot: any = next.component!;
      let Component = ActivatedRouteSnapshot.name;
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
