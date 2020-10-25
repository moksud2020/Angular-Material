import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import * as moment from "moment";
import { NavigationEnd } from '@angular/router';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialloginService } from '../../services/sociallogin.service';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
const googleLogoURL = 
"https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
 
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  errorMessage: string = null
  
  loading = false;
  submitted = false;
   
  error = '';
  user: SocialUser;
 
  isLogging: boolean;
    
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthenticationService,
    private _authService: AuthService,private _loginService: SocialloginService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/home';
    this.isLogging = false;
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
    
    if (this.authService.checkAuthenticated()) {
       this.router.navigate([this.returnUrl]);
    }
  }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }


  onSubmit() {

      this.submitted = true;
      this.error = null;
       // stop here if form is invalid
       if (this.form.invalid) {
           return;
       }
       const username = this.form.get('username').value;
       const password = this.form.get('password').value;
       this.loading = true;
       this.authService.login(username, password)
           .pipe(first())
           .subscribe(
               data => {
                   this.router.navigate([this.returnUrl]);
                   this.formSubmitAttempt = true;
               },
               error => {
                   this.error = error;
                   this.loading = false;
                   this.loginInvalid = true;
               });       
    
  }
  
  signInWithGoogle(): void {
    this.isLogging = true;
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(googleUser => {
      this._loginService.socialLogin(googleUser)
        .subscribe((data) => {
          this.isLogging = false; 
          this.user = googleUser;
          this.isLogging = (googleUser != null);
          this.router.navigate([this.returnUrl]);
        });
    });
  }

  signInWithFB(): void {
   // this.isLogging = true;
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(fbUser => {
      this._loginService.socialLogin(fbUser)
      .subscribe((data) => {
        this.isLogging = false; 
        this.user = fbUser;
        this.isLogging = (fbUser != null);
        this.router.navigate([this.returnUrl]);
      });
    });
  }


  signInWithFB2(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithLinkedIn(): void {
   // this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signOut(): void {
    this._authService.signOut();
  }


}