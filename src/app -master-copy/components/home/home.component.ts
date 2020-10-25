import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { SocialloginService } from '../../services/sociallogin.service';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Material Demo';
  isAuthenticated: boolean;
  userName:any;
  constructor(public authService: AuthenticationService, 
              private _authService: SocialloginService, 
              private router: Router) 
              {
               this.isAuthenticated = this.authService.checkAuthenticated();              
              }

  ngOnInit() {
   this.isAuthenticated = this.authService.checkAuthenticated();
   if ((localStorage.getItem('currentUser') !== null)){
              this.userName = localStorage.getItem('currentUser');
  }
             
  }
  logout() {
    this.authService.logout('login');
    if(this._authService.isLoggedIn())
      this._authService.logout('login');
    this.isAuthenticated = this.authService.checkAuthenticated();
    
  }
  
  
}