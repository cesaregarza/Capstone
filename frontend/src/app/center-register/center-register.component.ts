import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import * as $ from 'jquery';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { LogicService } from "../Services/logic.service";
import { NavbarComponent } from "../navbar/navbar.component";
import { HttpClient } from "@angular/common/http";

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
  selector: 'app-center-register',
  templateUrl: './center-register.component.html',
  styleUrls: ['./center-register.component.scss']
})
export class CenterRegisterComponent implements OnInit {
  @ViewChild("fileInput") fileInput;
  selectedFile = null;
  selectedFileName = "";
  enviroment = {
    url: "https://localhost:3000/newuser"
  };
  constructor(
    public logic: LogicService,
    private navbar: NavbarComponent,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {
    this.logic = logic;
  }

  ngOnInit() {}

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),

    address: new FormControl("", [Validators.required]),

    location: new FormControl("", [Validators.required]),

    postal: new FormControl("", [Validators.required]),

    phone: new FormControl("", [Validators.required]),

    email: new FormControl("", [Validators.required]),

    hours: new FormControl("", [Validators.required]),

    tokenId: new FormControl("", [Validators.required]),

    picture: new FormControl("", [Validators.required]),
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

  onFileChange = event => {
    let image: File = event.target.files[0];
    if (image.size < 2097100 && (image.type == 'image/jpeg' || image.type == 'image/png')) {
  this.selectedFile = event.target.files[0];
  this.selectedFileName = this.selectedFile.name;
    } else {
      this.form.get('picture').setErrors({type: 'error'})
    }
  };

  sendForm = (values) =>  {
    console.log(values.passwords)
    let cURL = values.name.toLowerCase().split(' ').join('')
    let tempForm = new FormData();
    tempForm.append("name", values.name);
    tempForm.append("address", values.address);
    tempForm.append("location", values.location);
    tempForm.append("postal", values.postal);
    tempForm.append("phone", values.phone);
    tempForm.append("email", values.email);
    tempForm.append("hours", values.hours);
    tempForm.append("picture", this.selectedFile, cURL + this.logic.pictureId() + ".png");
    tempForm.append("cURL", cURL);
    tempForm.append('isDeleted', 'false');
    tempForm.append('tokenId', values.tokenId);
    tempForm.append('date_joined', Date.now().toString());
    tempForm.append('last_login', Date.now().toString());
    tempForm.append('usertype', '2');
    tempForm.append('password', values.passwords.password);

    // let tempForm = new Form
    if (this.form.status === "VALID") {
      this.http.post(this.enviroment.url, tempForm).subscribe(
        result => {
          if (result['status'] == 201) {
         this.form.reset();
         this.selectedFile = null;
         this.selectedFileName = "";
          }
        },
        err => {
          err['status'] == 409 ? this.form.controls.email.setErrors({already : true}) : '';
          err['status'] == 401 ? this.form.controls.tokenId.setErrors({required : true}) : '';
        }
      );

    }
  };
  matcher = new MyErrorStateMatcher();
}

