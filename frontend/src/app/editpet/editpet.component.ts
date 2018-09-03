import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
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
  selector: "app-editpet",
  templateUrl: "./editpet.component.html",
  styleUrls: ["./editpet.component.scss"]
})
export class EditpetComponent implements OnInit {
  @ViewChild("fileInput")
  fileInput;
  selectedFile = null;
  selectedFileName = "";
  enviroment = {
    url: "https://localhost:3000/pets"
  };
  pets: any;
  petId: string;
  petPath: string;
  constructor(
    private http: HttpClient,
    public logic: LogicService,
    private navbar: NavbarComponent,
    private cd: ChangeDetectorRef
  ) {
    this.http = http;
  }

  ngOnInit() {
    this.loadPets();
  }

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
    specie: new FormControl("", [Validators.required]),
    age: new FormControl("", [Validators.required]),
    breed: new FormControl("", [Validators.required]),
    size: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    gender: new FormControl("", [Validators.required]),
    petimage: new FormControl("")
  });

  deletePet = id => {
    this.http
      .patch(this.enviroment.url + "/id=" + id, [
        {
          propName: "isDeleted",
          value: true
        }
      ])
      .subscribe(result => {
        this.loadPets();
      });
  };

  loadPets = () => {
    this.http
      .get("https://localhost:3000/centers/id=" + this.navbar.userId)
      .subscribe((result: any) => {
        this.pets = result.pets;
      });
  };

  showEdit = petInfo => {
    this.form.controls.name.setValue(petInfo.name);
    this.form.controls.specie.setValue(petInfo.specie);
    this.form.controls.age.setValue(petInfo.age);
    this.form.controls.breed.setValue(petInfo.breed);
    this.form.controls.size.setValue(petInfo.size);
    this.form.controls.description.setValue(petInfo.description);
    this.form.controls.gender.setValue(petInfo.gender);
    this.petId = petInfo._id;
    this.petPath = petInfo.picture.split("https://localhost:3000/upload/")[1];
    document.getElementById("modal").click();
  };

  onFileChange = event => {
    let image: File = event.target.files[0];
    if (
      image.size < 2097100 &&
      (image.type == "image/jpeg" || image.type == "image/png")
    ) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.form.get("petimgage").setErrors({ type: "error" });
    }
  };

  sendForm = values => {
    let tempValues = [];
    let tempForm = new FormData();
    Object.keys(values).forEach(e => {
      e !== `petimage`
        ? tempValues.push({ propName: e, value: values[e] })
        : ``;
    });
    tempForm.append(
      "petimage",
      this.selectedFile,
      this.navbar.userId + this.logic.pictureId() + ".png"
    );
    // let tempForm = new Form
    if (this.form.status === "VALID") {
      if (!!this.selectedFile) {
        this.http
          .patch(this.enviroment.url + "/upid=" + this.petId, tempForm)
          .subscribe(result => {
            this.selectedFile = null;
            this.selectedFileName = "";
          });
      }

      this.http
        .patch(this.enviroment.url + "/id=" + this.petId, tempValues)
        .subscribe(
          result => {
            this.form.reset();

            this.selectedFile = null;
            this.selectedFileName = "";
            this.loadPets();
          },
          err => {
            console.log(err);
          }
        );
    }
  };
  matcher = new MyErrorStateMatcher();
}
