import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CentersComponent } from './centers/centers.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PetsComponent } from './home/pets/pets.component';
import { PetComponent } from './home/pet/pet.component';
import { CenterComponent } from './dashboard/center/center.component';
import { LikesComponent } from './dashboard/likes/likes.component';
import { OptionsComponent } from './dashboard/options/options.component';
import { PetRegisterComponent } from './dashboard/pet-register/pet-register.component';
import { UserComponent } from './dashboard/user/user.component';
import { CenterInfoComponent } from './centers/center/center.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService as AuthGuard } from './Services/auth-guard.service';
import { FacebooktokenComponent } from './facebooktoken/facebooktoken.component';
import { EditpetComponent } from './editpet/editpet.component';
import { CenterRegisterComponent } from './center-register/center-register.component';


const routes: Routes = [

  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'centers',
    component: CentersComponent
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
    path: 'pet/:id',
    component: PetComponent
  },
  {
  path: 'center-register',
  component: CenterRegisterComponent
  },
  {
    path : 'facebook-token',
    component: FacebooktokenComponent
  },
  {
    path: 'dashboard/center',
    component: CenterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/likes',
    component: LikesComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: '1'
    }
  },
  {
    path: 'dashboard/options',
    component: OptionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/petregister',
    component: PetRegisterComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: '2'
    }
  },
  {
    path: 'dashboard/editpet',
    component: EditpetComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: '2'
    }
  },
  {
    path: 'dashboard/user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: '1'
    }
  },
  {
    path: 'center/:id',
    component: CenterInfoComponent
  },
  {
    path: 'center',
    redirectTo: '/centers'
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/options',
    canActivate: [AuthGuard],
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
