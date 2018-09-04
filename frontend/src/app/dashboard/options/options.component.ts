import { Component, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
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
import { LogicService } from '../../Services/logic.service';

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
export class OptionsComponent implements OnInit, OnDestroy, OnChanges {

  private fbSub: Subscription;

  constructor(public auth: SessionsService, public http:HttpClient, public nav: NavbarComponent, public logic: LogicService) {
    this.auth = auth,
    this.http = http,
    this.nav = nav,
    this.logic = logic
  }

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  validatorBase = [Validators.minLength(8), Validators.maxLength(20)];
  oldPwValidators = this.validatorBase;
  newPwValidators = this.validatorBase;
  pwConfirmValidators = this.validatorBase;

  form = new FormGroup({
    nameFormControl: new FormControl("", [
      // Validators.required,
      Validators.maxLength(254)
    ]),
    passwords: new FormGroup(
      {
        oldPassword: new FormControl("", this.oldPwValidators),
        newPassword: new FormControl("", this.newPwValidators),

        passwordConfirm: new FormControl("", this.pwConfirmValidators),
      },
      { validators: this.passwordMatchValidator }
    )
  });
  passwordFields = this.form.get("passwords");
  oldPwField = this.passwordFields.get("oldPassword");
  newPwField = this.passwordFields.get("newPassword");
  pwConfirmField = this.passwordFields.get("passwordConfirm");

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
    let name=this.form.controls.nameFormControl.value;
    let oldPassword = this.form.get('passwords').get('oldPassword').value;
    let newPass = this.form.get('passwords').get('newPassword').value;
    let d = new Date();
    d.toLocaleString();

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
        if (result['status'] == 202) {
          this.formGroupDirective.resetForm();
          this.auth.getLogin();
          this.form.controls.nameFormControl.setValue(this.nav.userName);
          this.auth.toastr.success('Settings successfully updated', 'Success!', this.auth.toastrSettings);
        } else if (result['status'] == 304) {
          this.auth.toastr.warning('No changes were submitted', 'Warning', this.auth.toastrSettings);
        }
      })
      .catch(err => {
        if (err['status'] == 500){
          this.auth.toastr.error('An error occurred', 'Error', this.auth.toastrSettings);
        } else if (err['status'] == 400){
          this.auth.toastr.error('Wrong password', 'Error', this.auth.toastrSettings);
        } else if (err['status']== 304){
          this.auth.toastr.warning('No changes were submitted', 'Warning', this.auth.toastrSettings);
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

  ngOnChanges() {
    let temp = this.requirePasswordXNOR();

    if (temp) {
      this.oldPwValidators.push(Validators.required);
      this.newPwValidators.push(Validators.required);
      this.pwConfirmValidators.push(Validators.required);
    } else {
      this.oldPwValidators.pop();
      this.newPwValidators.pop();
      this.pwConfirmValidators.pop();
    }

    console.log(this.oldPwValidators);
  };

  ngOnDestroy(){
    this.fbSub.unsubscribe();
  };

  boop(){
    console.log(this.nav.userId);
  }

  clearFormGroupDirective(){

  }

  //Using !! for type coercion, this will force true values if the is any length in the fields and false if they're empty. Then it will do A XNOR (B AND C). The case where B = 0 and C > 0 or vice-versa will resolve to true, but this does not matter since the mismatch validator will prevent this case from validating.
  requirePasswordXNOR(){
    let a = !!this.oldPwField.value;
    let b = !!this.newPwField.value;
    let c = !!this.pwConfirmField.value;

    let d = (b && c);
    return !this.logic.logicXor(a, d);
  }

  hide = true;
  matcher = new MyErrorStateMatcher();
}
