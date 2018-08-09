import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-testbed',
  templateUrl: './testbed.component.html',
  styleUrls: ['./testbed.component.css']
})
export class TestbedComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) {
    this.loggedIn = new Subject();
    // this.getLogin();
  }

  ngOnInit() {
  }

  environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
  };

  email: String = "test@test.com";
  password: String = "password";
  loggedIn: Subject<boolean>;

  doLogin(){
    this.http.post(this.environment.apiUrl + '/login', {
      email: this.email,
      password: this.password
    }, {
      withCredentials: true
    }).subscribe(((resp: any) => {
      this.loggedIn.next(true);
    }, {err})) //FINISH THIS
  }

}
