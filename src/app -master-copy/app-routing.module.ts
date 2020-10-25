import { DummyComponent } from './components/dummy/dummy.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedirectGuard } from './services/redirect-guard.service';

import { AuthguardService } from './services/auth-guard.service';
import {  AuthenticationService } from './services/auth.service';

import { InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CallbackComponent } from './components/login/callback.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {    
      title: 'Login Page'    
    }    
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthguardService ],
    data: {    
      title: 'Dashboard Page'    
    }    
  },
  
  {
    path: 'dummy',
    component: DummyComponent,
    canActivate: [ AuthguardService ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }