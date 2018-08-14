import { Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

import { CustomValidators } from "./equal-validator.directive";

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
  constructor() {}

  public validPassword = false;

  ngOnInit() {}
  isNotEqual = () => {
    if (this.validPassword == false) {
      return { mismatch: true };
    }
    return null;
  };

  form = new FormGroup({
    emailFormControl: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ]),
    passwords: new FormGroup(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(8)
        ]),

        passwordConfirm: new FormControl("", [
          Validators.required,
          Validators.minLength(8)
        ])
      },
      { validators: this.passwordMatchValidator }
    )
  });

  passwordMatchValidator(g: FormGroup) {
    let password = g.get("password").errors;
    let passwordConfirm = g.get("passwordConfirm").errors;
    if (g.get("password").value === g.get("passwordConfirm").value) {
      // this.validPassword = true;
      delete password.mismatch;
      delete passwordConfirm.mismatch;
      g.get("password").setErrors(password);
      g.get("passwordConfirm").setErrors(passwordConfirm);
      return null;
    }
    password.mismatch = true;
    passwordConfirm.mismatch = true;
    g.get("password").setErrors(password);
    g.get("passwordConfirm").setErrors(password);
    // this.validPassword = false;
    return { mismatch: true };
  }

  sendForm = () => {
    console.log(this.form.get("passwords").hasError("mismatch"));
  };

  hide = true;
  matcher = new MyErrorStateMatcher();
}
