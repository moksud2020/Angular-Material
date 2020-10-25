import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/auth.service';
import { SocialloginService } from './services/sociallogin.service';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Material Demo';
  isAuthenticated: boolean;

  constructor(public authService: AuthenticationService, 
              private _authService: AuthService, 
              private router: Router) 
              {
               this.isAuthenticated = this.authService.checkAuthenticated();              
               this.isAuthenticated = true;
              }

  ngOnInit() {
   //this.isAuthenticated = this.authService.checkAuthenticated();
   //this.isAuthenticated = true;
  }
  logout() {
   // this.authService.logout();
  
    this.authService.logout('login');
    this._authService.signOut();
    //this.router.navigate(['login']);
    this.isAuthenticated = this.authService.checkAuthenticated();
    
  }
  
  
}