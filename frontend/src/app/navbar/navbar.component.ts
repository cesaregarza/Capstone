import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionsService } from "../Services/sessions.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userInfo: any;
  userName: string;
  usertype: string;
  userId: string;
  private authListenerSubs: Subscription;
  private userInfoSubs: Subscription;

  constructor(public auth: SessionsService, public router: Router) {
    this.auth = auth;
    this.router = router;
  }

  ngOnInit() {
    this.authListenerSubs = this.auth
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        console.log(this.userIsAuthenticated)
      });

    this.userInfoSubs = this.auth
    .getUserInfoListener()
    .subscribe(userInfo => {
      this.userName = userInfo.name;
      this.usertype = userInfo.usertype;
      this.userId = userInfo._id;
      console.log(userInfo);

    });
  }
  ngOnDestroy() {}

  toggle(){
  this.auth.opened = !this.auth.opened;
  console.log(this.userId, this.userName);
  }
}
