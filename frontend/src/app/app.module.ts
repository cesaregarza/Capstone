import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestbedComponent } from './testbed/testbed.component';
import { RoutingModule } from './/routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TestbedComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
