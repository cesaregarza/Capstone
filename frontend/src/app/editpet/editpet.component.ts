import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavbarComponent } from "../navbar/navbar.component";
import { load } from "@angular/core/src/render3/instructions";

@Component({
  selector: "app-editpet",
  templateUrl: "./editpet.component.html",
  styleUrls: ["./editpet.component.scss"]
})
export class EditpetComponent implements OnInit {
  pets: any;
  constructor(private http: HttpClient, private navbar: NavbarComponent) {
    this.http = http;
  }

  ngOnInit() {
    this.loadPets();
  }

  deletePet = id => {
    this.http
      .patch("https://localhost:3000/pets/id=" + id, [
        {
          propName: "isDeleted",
          value: true
        }
      ])
      .subscribe(result => {
        this.loadPets();
      });
  };

  loadPets() {
    this.http
      .get("https://localhost:3000/centers/id=" + this.navbar.userId)
      .subscribe((result: any) => {
        this.pets = result.pets;
        console.log(this.pets);
      });
  }
}
