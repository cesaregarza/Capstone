import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class ComponentAggregateService {

  constructor() { }
}
