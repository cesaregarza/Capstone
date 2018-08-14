import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TestbedComponent } from './testbed/testbed.component';
import { AboutComponent } from './about/about.component';
import { CentersComponent } from './centers/centers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PetsComponent } from './home/pets/pets.component';
import { PetComponent } from './home/pet/pet.component';
import { CenterComponent } from './dashboard/center/center.component';
import { ChangepwComponent } from './dashboard/changepw/changepw.component';
import { LikesComponent } from './dashboard/likes/likes.component';
import { OptionsComponent } from './dashboard/options/options.component';
import { PetRegisterComponent } from './dashboard/pet-register/pet-register.component';
import { UserComponent } from './dashboard/user/user.component';
import { CenterInfoComponent } from './centers/center/center.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: 'testbed',
    component: TestbedComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'centers',
    component: CentersComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'pets',
    component: PetsComponent
  },
  {
    path: 'pet',
    component: PetComponent
  },
  {
    path: 'dashboard/center',
    component: CenterComponent
  },
  {
    path: 'dashboard/changepw',
    component: ChangepwComponent
  },
  {
    path: 'dashboard/likes',
    component: LikesComponent
  },
  {
    path: 'dashboard/options',
    component: OptionsComponent
  },
  {
    path: 'dashboard/petregister',
    component: PetRegisterComponent
  },
  {
    path: 'dashboard/user',
    component: UserComponent
  },
  {
    path: 'centerinfo',
    component: CenterInfoComponent
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**',
  component: PageNotFoundComponent
}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule { }
