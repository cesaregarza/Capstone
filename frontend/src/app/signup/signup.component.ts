import { Component, OnInit } from "@angular/core";
import * as $ from 'jquery';

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
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  constructor(public http: HttpClient, public router: Router) {
    this.http = http,
    this.router = router
  }

  public validPassword = false;

  ngOnInit() {}
  isNotEqual = () => {
    if (this.validPassword == false) {
      return { mismatch: true };
    }
    return null;
  };

  form = new FormGroup({
    nameFormControl: new FormControl("", [
      Validators.required,
      Validators.maxLength(254)
    ]),
    emailFormControl: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ]),
    passwords: new FormGroup(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]),

        passwordConfirm: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ])
      },
      { validators: this.passwordMatchValidator }
    )
  });

  passwordMatchValidator(g: FormGroup) {
    let password = g.get("password").errors;
    let passwordConfirm = g.get("passwordConfirm").errors;
    if (g.get("password").value === g.get("passwordConfirm").value) {

      if (password !== null) {
        password.mismatch != undefined ? delete password.mismatch : "";
      }

      if (passwordConfirm !== null) {
        passwordConfirm.mismatch != undefined ? delete passwordConfirm.mismatch : "";
      }

      if ($.isEmptyObject(password))
      {
          password = null;
      }
      if ($.isEmptyObject(passwordConfirm))
      {
          passwordConfirm = null;
      }

      g.get("password").setErrors(password);
      g.get("passwordConfirm").setErrors(passwordConfirm);
      return null;
    }

    password == null ? (password = {}) : "";
    passwordConfirm == null ? (passwordConfirm = {}) : "";
    password.mismatch = true;
    passwordConfirm.mismatch = true;

    g.get("password").setErrors(password);
    g.get("passwordConfirm").setErrors(passwordConfirm);

    return { mismatch: true };
  }

  sendForm = () => {
    var d = new Date();
    d.toLocaleString();
    if (this.form.status === "VALID") {
      this.http.post('https://localhost:3000/newuser',{
        name: this.form.get('nameFormControl').value,
        email: this.form.get('emailFormControl').value,
        isDeleted: false,
        usertype: "1",
        password: this.form.get('passwords').get('password').value,
        date_joined: d.toLocaleString(),
        last_login: d.toLocaleString(),
      })
      .toPromise()
      .then(result => {
        if (result['status'] == 201) {
          this.form.reset();
          this.router.navigate(['/login']);
          // console.log('User Created');
        }
      })
      .catch(err => {
        if (err['status'] == 409) {
          this.form.get("emailFormControl").setErrors({already: true});
          // console.log('User already exist');
        } else if (err['status'] == 500) {
          // console.log('Error');
        }
      })
    }
  };
  hide = true;
  matcher = new MyErrorStateMatcher();
}
