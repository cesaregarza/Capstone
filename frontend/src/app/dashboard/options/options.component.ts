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

import { NavbarComponent } from '../../navbar/navbar.component';

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

  private fbSub: Subscription;

  constructor(public auth: SessionsService, public http:HttpClient, public nav: NavbarComponent) {
    this.auth = auth,
    this.http = http,
    this.nav = nav
  }

  form = new FormGroup({
    nameFormControl: new FormControl("", [
      // Validators.required,
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
  passwordFields = this.form.get("passwords");

  passwordMatchValidator(g: FormGroup) {
    let newPassword = g.get("newPassword").errors;
    let passwordConfirm = g.get("passwordConfirm").errors;

    if (g.get("newPassword").value === g.get("passwordConfirm").value) {

      if (!!newPassword){
        if (!!newPassword.mismatch){
          delete newPassword.mismatch;
        }
      }
      
      if (!!passwordConfirm){
        if (!!passwordConfirm.mismatch){
          delete passwordConfirm.mismatch;
        }
      }

      if ($.isEmptyObject(newPassword)){
        newPassword = null;
      }

      if ($.isEmptyObject(passwordConfirm)){
        passwordConfirm = null;
      }

      g.get("newPassword").setErrors(newPassword);
      g.get("passwordConfirm").setErrors(passwordConfirm);
      return null;
    }

    if (!newPassword){
      newPassword = {};
      newPassword.mismatch = true;
    }
    if (!passwordConfirm){
      passwordConfirm = {};
      passwordConfirm.mismatch = true;
    }

    g.get("newPassword").setErrors(newPassword);
    g.get("passwordConfirm").setErrors(passwordConfirm);

    return {mismatch: true};
  }

  sendForm () {
    console.log("click");

    let name=this.form.controls.nameFormControl.value;
    let oldPassword = this.form.get('passwords').get('oldPassword').value;
    let newPass = this.form.get('passwords').get('newPassword').value;
    let d = new Date();
    d.toLocaleString();

    console.log(this.form);

    if (this.form.status == "VALID"){
      this.http.post('https://localhost:3000/editops',{
        name: name,
        oldPassword: oldPassword,
        newPassword: newPass,
        id: this.nav.userId
      }, {
        withCredentials: true,
      })
      .toPromise()
      .then(result => {
        console.log(result);
        if (result['status'] == 202) {
          this.form.reset();
          this.auth.toastr.success('Password successfully changed', 'Success!', this.auth.toastrSettings);
        }
      })
      .catch(err => {
        if (err['status'] == 500){
          this.auth.toastr.error('An error occurred', 'Error', this.auth.toastrSettings);
        } else if (err['status'] == 400){
          this.auth.toastr.error('Wrong password', 'Error', this.auth.toastrSettings);
        }
      })
    }
  };

  ngOnInit() {
    this.fbSub = this.auth.getUserInfoListener().subscribe(userInfo => {
      if (userInfo.fb){
        this.passwordFields.disable();
      }
      this.form.controls.nameFormControl.setValue(userInfo.name);
    });
  }

  ngOnDestroy(){
    this.fbSub.unsubscribe();
  };

  boop(){
    console.log(this.nav.userId);
  }

  hide = true;
  matcher = new MyErrorStateMatcher();
}
