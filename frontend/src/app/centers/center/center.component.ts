import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionsService } from "../../Services/sessions.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-center",
  templateUrl: "./center.component.html",
  styleUrls: ["./center.component.scss"]
})
export class CenterInfoComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  centerInfo: any;
  centerInfoFound = false;
  environment = {
    production: false,
    apiUrl: "https://localhost:3000/centers"
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: SessionsService,
    public http: HttpClient
  ) {
    this.auth = auth;
    this.http = http;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params["id"];
      this.http.get(this.environment.apiUrl + '/cURL=' + this.id).subscribe((result: any) => {
        console.log(result)
        if (!this.isEmpty(result)){
          this.centerInfo = result.center[0];
          this.centerInfoFound = true;
        } else {
         this.router.navigate(['/centers'])
        }
      }, err => console.log(err))
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

  isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
}
