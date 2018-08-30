import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { LogicService } from "../../Services/logic.service";
import { NavbarComponent } from "../../navbar/navbar.component";
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
  selector: "app-pet-register",
  templateUrl: "./pet-register.component.html",
  styleUrls: ["./pet-register.component.scss"]
})
export class PetRegisterComponent implements OnInit {
  @ViewChild("fileInput") fileInput;
  selectedFile = null;
  selectedFileName = "";
  enviroment = {
    url: "https://localhost:3000/pets"
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

    specie: new FormControl("", [Validators.required]),

    age: new FormControl("", [Validators.required]),

    breed: new FormControl("", [Validators.required]),

    size: new FormControl("", [Validators.required]),

    description: new FormControl("", [Validators.required]),

    gender: new FormControl("", [Validators.required]),

    petimage: new FormControl("", [Validators.required])
  });

  onFileChange = event => {
    let image: File = event.target.files[0];
    if (image.size < 2097100 && (image.type == 'image/jpeg' || image.type == 'image/png')) {
  this.selectedFile = event.target.files[0];
  this.selectedFileName = this.selectedFile.name;
    } else {
      this.form.get('petimgage').setErrors({type: 'error'})
    }
  };

  sendForm = (values) =>  {

    var d = new Date();
    d.toLocaleString();
    let tempForm = new FormData();
    tempForm.append("name", values.name);
    tempForm.append("specie", values.specie);
    tempForm.append("age", values.age);
    tempForm.append("breed", values.breed);
    tempForm.append("size", values.size);
    tempForm.append("description", values.description);
    tempForm.append("gender", values.gender);
    tempForm.append("petimage", this.selectedFile, this.navbar.userId + this.logic.pictureId() + ".png");
    tempForm.append("center", this.navbar.userId);
    tempForm.append('isDeleted', 'false');
    tempForm.append('location', this.navbar.userLocation);

    // let tempForm = new Form
    if (this.form.status === "VALID") {
      this.http.post(this.enviroment.url, tempForm).subscribe(
        result => {
         this.form.reset();
         this.selectedFile = null;
         this.selectedFileName = "";
        },
        err => {
          console.log(err)
        }
      );

    }
  };
  matcher = new MyErrorStateMatcher();
}
