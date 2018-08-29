import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionsService } from "../Services/sessions.service";

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
    private router: Router
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

  movePage = pageNumber => {
    this.paginationBar = [];
    let max = this.limitPages;
    let current = pageNumber;

  for (let i = (max - current > 2) ? current - 2 : max - 4, j = 0; (i < current+3 && i <= max) || j < 5; i++, j++){
    i = i < 1 ? 1 : i;
    this.paginationBar.push(i);
  }
    this.find(pageNumber);
  }

  find = pageNumber => {
    let url = "https://localhost:3000/search/";
    url = url + "location=" + this.city + "&";
    url = url + "specie=" + this.specie + "&";
    url = url + "pn=" + pageNumber;
    this.pageNumber = pageNumber;
    this.http.get(url).subscribe(
      (pets: any) => {
        if (!this.isEmpty(pets)) {
          this.pets = pets;
          this.countAll = pets.total;
          this.limitPages = Math.ceil(this.countAll / 12);
        }
      },
      err => {
        if (err.status == 404) {
          this.router.navigate(["home"]);
        }
        console.log(err);
      }
    );

    // .toPromise()
    // .then(pets => {
    //   this.pets = pets
    // })
    // .catch(err => {
    //   console.log(err);
    // })
  };

  isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
}
