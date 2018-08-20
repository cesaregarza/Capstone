import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionsService } from "../Services/sessions.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userInfo: any;
  userName: string;
  private authListenerSubs: Subscription;
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
      this.userName = userInfo
    });

  }
  ngOnDestroy() {}


  toggle(){
  this.auth.opened = !this.auth.opened
  }
}
