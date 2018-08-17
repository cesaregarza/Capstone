import { Injectable, OnInit } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { SessionsService } from "./sessions.service";
import { Observable } from "../../../node_modules/rxjs";
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: SessionsService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.auth.isAuthenticated();
    if (isAuth) {
    return true
    }
    this.router.navigate(['login']);
    return false


  }
}
