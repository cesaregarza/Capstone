import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { SessionsService } from '../Services/sessions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userIsAuthenticated = false;

  constructor(private router: Router, private auth: SessionsService) {



   }

  ngOnInit() {
    this.auth
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    if (this.userIsAuthenticated){
      this.router.navigate(['login'])
    }
  }

}
