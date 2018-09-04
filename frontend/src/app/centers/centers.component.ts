import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavbarComponent } from "../navbar/navbar.component";
import { LogicService } from "../Services/logic.service";

@Component({
  selector: "app-centers",
  templateUrl: "./centers.component.html",
  styleUrls: ["./centers.component.scss"]
})
export class CentersComponent implements OnInit {
  centers: any;
  paginationBar = [1, 2, 3, 4, 5];
  pageNumber = 1;
  countAll = 12;
  limitPages = 3;
  constructor(
    private http: HttpClient,
    private logic: LogicService,
    private navbar: NavbarComponent
  ) {
    this.http = http;
  }

  ngOnInit() {
    this.movePage(this.pageNumber);
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
    this.findCenters(pageNumber);
  };

  findCenters = pageNumber => {
    let url = "https://localhost:3000/centers/";
    url = url + "pn=" + pageNumber;
    this.pageNumber = pageNumber;
    this.http
      .get(url)
      .toPromise()
      .then((centers: any) => {
        if (!this.logic.isEmpty(centers)) {
          this.centers = centers.centers;
          this.countAll = centers.total;
          this.limitPages = Math.ceil(this.countAll / 12);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}
