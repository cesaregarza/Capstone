import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { SessionsService } from '../Services/sessions.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() {}
  ngOnInit() {}
}
