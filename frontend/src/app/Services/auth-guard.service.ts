import { Injectable, OnInit } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { SessionsService } from "./sessions.service";
import { Observable } from "../../../node_modules/rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
const jwt = new JwtHelperService();
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: SessionsService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.auth.isAuthenticated();
    let usertype = jwt.decodeToken(localStorage.getItem('token')).usertype
    let expectedRole = route.data.expectedRole ? true : false;
    if (isAuth) {
      // check if the route need a specific role
      if ((expectedRole && usertype == route.data.expectedRole) || !expectedRole) {
        return true
      } else {
        this.router.navigate(['dashboard/options']);
        return false
      }
    }
    this.router.navigate(['login']);
    return false


  }
}
