import { Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SessionsService } from "../Services/sessions.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor(public http: HttpClient, public router: Router, public auth: SessionsService) {
    (this.http = http), (this.router = router);
  }

  public validPassword = false;

  ngOnInit() {}


  form = new FormGroup({
    emailFormControl: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ]),

    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20)
    ])
  });

  sendForm = () => {
    var d = new Date();
    d.toLocaleString();
    if (this.form.status === "VALID") {
      this.auth.doLogin(this.form.get('emailFormControl').value, this.form.get('password').value)
    }
  };
  hide = true;
  matcher = new MyErrorStateMatcher();
}
