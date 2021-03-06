import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionsService } from "../../Services/sessions.service";
import { LogicService } from "../../Services/logic.service";

@Component({
  selector: "app-pet",
  templateUrl: "./pet.component.html",
  styleUrls: ["./pet.component.scss"]
})
export class PetComponent implements OnInit, OnDestroy {
  id: number;
  private sub: any;
  petInfo: any;
  petInfoFound = false;
  environment = {
    production: false,
    apiUrl: "https://petsrgv1-petsrgv.7e14.starter-us-west-2.openshiftapps.com/pets"
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: SessionsService,
    public http: HttpClient,
    private logic: LogicService
  ) {
    this.auth = auth;
    this.http = http;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params["id"];
      this.http.get(this.environment.apiUrl + "/id=" + this.id).subscribe(
        (result: any) => {
          if (!this.logic.isEmpty(result)) {
            this.petInfo = result.pets;
            this.petInfoFound = true;
          } else {
            this.router.navigate(["/home"]);
          }
        },
        err => console.log(err)
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
