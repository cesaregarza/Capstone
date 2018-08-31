import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subject, Subscription, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { ToastrService } from 'ngx-toastr';

const jwt = new JwtHelperService();
@Injectable({
  providedIn: "root"
})
export class SessionsService {
  public isValid = false;
  public loggedIn = new Subject < boolean > ();
  private userInfo = new Subject < any > ();
  public isAuthSub: Subscription;
  public userId: String;
  public petInfo: Object;

  constructor(private http: HttpClient, public router: Router, public toastr: ToastrService) {
    this.http = http;
    this.router = router;
    this.toastr = toastr;
  }

  toastrSettings = {
    timeOut: 2000,
    extendedTimeOut: 1000,
    progressBar: true,
  };

  environment = {
    production: false,
    apiUrl: "https://localhost:3000/user/"
  };

  email: String = "123@123.com";
  password: String = "123";
  events: string[] = [];
  opened: boolean;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h =>
    h.test(window.location.host)
  );

  isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false and return if the session
    const token = localStorage.getItem("token");
    return !jwt.isTokenExpired(token) ? true : false;

  }



  getAuthStatusListener() {
    // Get login session with refresh page
    this.getLogin();
    return this.loggedIn.asObservable();
  }

  getUserInfoListener() {
    return this.userInfo.asObservable();
  }

  doLogin(mail, pass) {
    // this.deleteLocalSession();
    this.http
      .post(
        this.environment.apiUrl + "login", {
          email: mail,
          password: pass
        }, {
          withCredentials: true
        }
      )
      .toPromise()
      .then((resp: any) => {
        console.log(resp);
        const token = resp.token;
        localStorage.setItem("token", token);
        this.getLogin();
        this.router.navigate(["/dashboard/options"]);
        if (resp['status'] == 200){
          this.toastr.success('Welcome!', 'Login Successful', this.toastrSettings);
        }
      })
      .catch(err => {
        console.log(err);
     this.deleteLocalSession();
     this.toastr.error('Login failed', 'Error', this.toastrSettings);
      });
    // .subscribe((resp: any) => {
    //   console.log(resp)
    //   console.log("success!");
    //   this.loggedIn.next(true);
    // }, (err) => {
    //   console.log(err)
    //   this.loggedIn.next(false);
    // });
  }

  facebook() {
    window.location.href = "" + this.environment.apiUrl + "login/facebook";
  }

  getLogin() {
    console.log('getLogin');
    this.http
      .get(this.environment.apiUrl + "login", {
        withCredentials: true // <=========== important!
      })
      .subscribe(
        (resp: any) => {
          if (resp) {
            this.userInfo.next(resp);
            this.loggedIn.next(true);
            this.userId = resp._id;
          }
        },
        err => {
          this.userInfo.next('');
          this.loggedIn.next(false);
        }
      );
  }

  doLogout() {
    this.http
      .post(
        this.environment.apiUrl + "logout", {}, {
          withCredentials: true
        }
      )
      .subscribe(() => {
        this.deleteLocalSession();
        this.router.navigate(["login"]);
        this.toastr.success('Successfully logged out', 'Success', this.toastrSettings);
      });
  }

  deleteLocalSession(){
    localStorage.removeItem("token");
    Cookie.delete('token', '/');
    this.userInfo.next('');
    this.loggedIn.next(false);
  }
}
