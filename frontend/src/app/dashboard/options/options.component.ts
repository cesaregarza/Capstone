import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionsService } from '../../Services/sessions.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
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
