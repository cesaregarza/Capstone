import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from 'ng2-cookies';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler ) {
    const cookie = new CookieService
    let authToken: string;
    if (cookie.check('token')){
    localStorage.setItem('token', cookie.get('token'))
    }
    authToken = localStorage.getItem('token');
    const authRequest = req.clone({
      headers: req.headers.set('Autorization', 'Bearer ' + authToken)
    })

    return next.handle(authRequest);
  }
}
