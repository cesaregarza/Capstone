import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { HttpClient } from "@angular/common/http";
import { SessionsService } from '../../Services/sessions.service';

import * as $ from 'jquery';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control && control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userInfo: any;
  userEmail: String;
  userId: String;
  userName: String;
  private userInfoSubs: Subscription;

  constructor(public auth: SessionsService, public http:HttpClient) {
    this.auth = auth,
    this.http = http
  }

  form = new FormGroup({
    nameFormControl: new FormControl("", [
      Validators.required,
      Validators.maxLength(254)
    ]),
    passwords: new FormGroup(
      {
        oldPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]),

        passwordConfirm: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]),
      },
      { validators: this.passwordMatchValidator }
    )
  });

  passwordMatchValidator(g: FormGroup) {
    let newPassword = g.get("newPassword").errors;
    let passwordConfirm = g.get("passwordConfirm").errors;
    let arr = [newPassword, passwordConfirm];

    if (g.get("newPassword").value === g.get("passwordConfirm").value) {

      for (let i = 0; i < arr.length; i++){
        let prop = arr[i];
        if (!prop){
          if (!prop.mismatch){
            delete prop.mismatch;
          }
        }
        if ($.isEmptyObject(prop)){
          prop = null;
        }
      }
      g.get("newPassword").setErrors(newPassword);
      g.get("passwordConfirm").setErrors(passwordConfirm);
      return null;
    }

    for (let j = 0; j < arr.length; j++){
      let prop = arr[j];

      if (!prop){
        prop = {};
        prop.mismatch = true;
      }
    }

    g.get("newPassword").setErrors(newPassword);
    g.get("passwordConfirm").setErrors(passwordConfirm);

    return {mismatch: true};
  }

  sendForm () {
    let oldPassword = this.form.get('passwords').get('oldPassword').value;
    let newPass = this.form.get('passwords').get('newPassword').value;
    let d = new Date();
    d.toLocaleString();

    if (this.form.status == "VALID"){
      this.http.post('https://localhost:3000/editops',{
        oldPassword: oldPassword,
        newPassword: newPass,
        id: this.userId
      })
      .toPromise()
      .then(result => {
        if (result['status'] == 202) {
          this.form.reset();
        }
      })
      .catch(err => {
        if (err['status'] == 500){
        }
      })
    }
  };

  ngOnInit() {
    this.userInfoSubs = this.auth
    .getUserInfoListener()
    .subscribe(userInfo => {
      this.userInfo = userInfo;
      this.userId = this.userInfo._id;
      this.userName = this.userInfo.name;
    });
  }

  ngOnDestroy(){
    this.userInfoSubs.unsubscribe;
  };

  boop(){
    console.log(this.userId);
  }
}
