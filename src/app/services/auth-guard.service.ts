import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {  AuthenticationService } from '../services/auth.service';
import { SocialloginService } from '../services/sociallogin.service';

@Injectable()
export class AuthguardService implements CanActivate {
  constructor(private router: Router, private authService:  AuthenticationService, private socilaService: SocialloginService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('access_token')) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
 /* checkLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socilaService.isFBLoggedIn.then(() => {
          resolve(true);
      }).catch(() => {
          this.router.navigate(['/welcome']);
          reject(false);
      });
    });
  }
*/
  /*async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("Gurd",this.authService.checkAuthenticated());
    if (this.authService.checkAuthenticated()) {
       this.router.navigate(['login']);
      return false;
    }
    return true;
  }*/

}
