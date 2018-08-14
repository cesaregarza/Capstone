import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule
} from '@angular/common/http';
import {
  HttpModule
} from '@angular/http';
import {
  Subject
} from 'rxjs';

@Component({
  selector: 'app-testbed',
  templateUrl: './testbed.component.html',
  styleUrls: ['./testbed.component.css']
})
export class TestbedComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) {
    this.http = http;
    this.loggedIn = new Subject();
    this.getLogin();
    console.log(this.loggedIn);
  }

  environment = {
    production: false,
    apiUrl: 'http://localhost:3000/user/'
  };

  email: String = "123@123.com";
  password: String = "123";
  loggedIn: Subject < boolean > ;
  ngOnInit() {}


  doLogin() {
    this.http.post(this.environment.apiUrl + 'login', {
      email: this.email,
      password: this.password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log(resp)
      console.log("success!");
      this.loggedIn.next(true);
    }, (err) => {
      console.log(err)
      this.loggedIn.next(false);
    })
  }

  getLogin() {
    this.http.get(this.environment.apiUrl + 'login', {
      withCredentials: true // <=========== important!
    }).subscribe((resp: any) => {
      console.log(resp);
      this.loggedIn.next(resp.loggedIn);
    }, (err) => {
      console.error(err);
    })
  };

  doLogout() {
    this.http.post(this.environment.apiUrl + 'logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this.loggedIn.next(false);
    });
  }

}
