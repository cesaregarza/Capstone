import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SessionsService } from "../../Services/sessions.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-center",
  templateUrl: "./center.component.html",
  styleUrls: ["./center.component.css"]
})
export class CenterInfoComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  environment = {
    production: false,
    apiUrl: "https://localhost:3000/centers"
  };

  constructor(
    private route: ActivatedRoute,
    public auth: SessionsService,
    public http: HttpClient
  ) {
    this.auth = auth;
    this.http = http;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params["id"];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchCenterInfo() {
    this.http.get(this.environment.apiUrl).subscribe(result => {
      console.log(result);
    })
  }
}
