import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PageEvent} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SessionsService } from '../Services/sessions.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, public auth: SessionsService) {
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
    // let location = (<HTMLInputElement>document.getElementById('location')).value;
    // let specie = (<HTMLInputElement>document.getElementById('specie')).value;
    console.log(this.city, this.specie);
    // this.city !== '' ? url = url + 'location=' + this.city + '&': this.city = '';
    // this.specie !== '' ? url = url + 'specie=' + this.specie + '&': this.specie = '';
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


}
