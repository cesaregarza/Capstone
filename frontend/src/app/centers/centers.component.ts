import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-centers",
  templateUrl: "./centers.component.html",
  styleUrls: ["./centers.component.scss"]
})
export class CentersComponent implements OnInit {
  centers: any;
  constructor(private http: HttpClient, private navbar: NavbarComponent) {
    this.http = http;
  }

  ngOnInit() {
    this.http.get("https://localhost:3000/centers").subscribe((result: any) => {
      this.centers = result.centers;
    });
  }
}
