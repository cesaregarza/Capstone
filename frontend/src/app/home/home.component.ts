import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PageEvent} from '@angular/material';
import { SessionsService } from '../Services/sessions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, public auth: SessionsService, private router: Router) {
    this.http = http;

  }
  pets = {};
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  city = "";
  specie = "";
  ngOnInit() {
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log(1);
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  find = () => {
    let url = "https://localhost:3000/search/";
    console.log(this.city, this.specie);
    url = url + 'location=' + this.city + '&';
    url = url + 'specie=' + this.specie + '&';

    this.http.get(url)
    .subscribe((pets: any) => {
      this.pets = pets
    }, (err) => {
      console.log(err);

    })



    // .toPromise()
    // .then(pets => {
    //   this.pets = pets
    // })
    // .catch(err => {
    //   console.log(err);
    // })
  }
moreInfo = (petInfo) => {
this.router.navigate(['pet'])
}

}
