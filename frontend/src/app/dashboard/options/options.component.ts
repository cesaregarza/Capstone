import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionsService } from '../../Services/sessions.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userInfo: any;
  userEmail: String;
  userId: String;
  userName: String;
  private userInfoSubs: Subscription;

  constructor(public auth: SessionsService) {
    this.auth = auth;
  }
  ngOnInit() {
    this.userInfoSubs = this.auth
    .getUserInfoListener()
    .subscribe(userInfo => {
      this.userInfo = userInfo;
      this.userId = this.userInfo._id;
      this.userName = this.userInfo.name;
    });
  }

  ngOnDestroy(){
    this.userInfoSubs.unsubscribe;
  };

  boop(){
    console.log(this.userId);
  }
}
