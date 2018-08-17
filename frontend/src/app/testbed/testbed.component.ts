import { Component, OnInit } from "@angular/core";
import { SessionsService } from "../Services/sessions.service";

@Component({
  selector: "app-testbed",
  templateUrl: "./testbed.component.html",
  styleUrls: ["./testbed.component.css"]
})
export class TestbedComponent implements OnInit {
  constructor(public auth: SessionsService) {
    this.auth = auth;
  }
  ngOnInit() {}
  // this.auth

}
