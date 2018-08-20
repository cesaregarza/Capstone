import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { SessionsService } from '../Services/sessions.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userIsAuthenticated = false;
  userInfo: any;
  userEmail: string;
  private authListenerSubs: Subscription
  private userInfoSubs: Subscription;

  constructor(public auth: SessionsService) {
    this.auth = auth;
  }
  ngOnInit() {
    this.authListenerSubs = this.auth
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userInfoSubs = this.auth
    .getUserInfoListener()
    .subscribe(userInfo => {
      this.userInfo = userInfo
      this.userEmail = this.userInfo.email;
    });
  }
}
