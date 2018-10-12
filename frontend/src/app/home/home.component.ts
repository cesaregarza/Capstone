import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionsService } from "../Services/sessions.service";
import { LogicService } from "../Services/logic.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public auth: SessionsService,
    private route: ActivatedRoute,
    private router: Router,
    private logic: LogicService
  ) {
    this.http = http;
  }
  paginationBar = [1, 2, 3, 4, 5];
  pets = {};
  city = "";
  specie = "";
  pageNumber = 1;
  countAll = 12;
  limitPages = 3;

  ngOnInit() {
    this.find(this.pageNumber);
  }

callLike = (petId) => {
  this.auth.like(petId);
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
    url = url + "location=" + this.city + "&";
    url = url + "specie=" + this.specie + "&";
    url = url + "pn=" + pageNumber;
    this.pageNumber = pageNumber;
    this.http
      .get(url)
      .toPromise()
      .then((pets: any) => {
        if (!this.logic.isEmpty(pets)) {
          this.pets = pets;
          this.countAll = pets.total;
          this.limitPages = Math.ceil(this.countAll / 12);
        }
      })
      .catch(err => {
        if (err.status == 404) {
          this.router.navigate(["home"]);
        }
        console.log(err);
      });
  };
}
