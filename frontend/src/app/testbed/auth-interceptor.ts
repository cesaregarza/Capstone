import { HttpInterceptor, HttpHandler, HttpRequest } from "../../../node_modules/@angular/common/http";
import { Injectable } from "../../../node_modules/@angular/core";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('token');
    const authRequest = req.clone({
      headers: req.headers.set('Autorization', 'Bearer ' + authToken)
    })
    return next.handle(authRequest);
  }
}
