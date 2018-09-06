import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionsService } from "../../Services/sessions.service";
import { HttpClient } from "@angular/common/http";
import { LogicService } from "../../Services/logic.service";

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
  paginationBar = [1, 2, 3, 4, 5];
  pets = {};
  pageNumber = 1;
  countAll = 12;
  limitPages = 3;
  petsByPage = 6;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: SessionsService,
    private http: HttpClient,
    private logic: LogicService
  ) {
    this.auth = auth;
    this.http = http;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params["id"];
      this.http.get(this.environment.apiUrl + "/cURL=" + this.id).subscribe(
        (result: any) => {
          if (!this.logic.isEmpty(result)) {
            this.centerInfo = result.center[0];
            this.centerInfoFound = true;
            this.find(this.pageNumber);
          } else {
            this.router.navigate(["/centers"]);
          }
        },
        err => console.log(err)
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  movePage = pageNumber => {
    this.paginationBar = [];
    let max = this.limitPages;
    let current = pageNumber;
    for (
      let i = max - current > 2 ? current - 2 : max - 4, j = 0;
      (i < current + 3 && i <= max) || j < 5;
      i++, j++
    ) {
      i = i < 1 ? 1 : i;
      this.paginationBar.push(i);
    }
    this.find(pageNumber);
  };

  find = pageNumber => {
    let url = "https://localhost:3000/search/";
    url = url + "pn=" + pageNumber;
    url = url + "&ps=" + this.petsByPage
    url = url + "&center=" + this.centerInfo._id;
    this.pageNumber = pageNumber;
    this.http
      .get(url)
      .toPromise()
      .then((pets: any) => {
        if (!this.logic.isEmpty(pets)) {
          this.pets = pets;
          this.countAll = pets.total;
          this.limitPages = Math.ceil(this.countAll / 6);
        }
      })
      .catch(err => {
        if (err.status == 500) {
          this.router.navigate(["home"]);
        }
        console.log(err);
      });
  };
}
