import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  AuthenticationService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import * as moment from "moment";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMessage: string = null
  userObject = {
    uname: "",
    uemail: "",
    upass: ""
  }
  loading = false;
  submitted = false;
 
  error = '';
  confirmPass: string = ""
  private returnUrl: string;
  constructor(private _loginService:  AuthenticationService, 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/home';
  }
  registerUser()
  {
    if (this.userObject.uname.trim() !== "" && this.userObject.upass.trim() !== "" && (this.userObject.upass.trim() === this.confirmPass))
    {
    this._loginService.signup(this.userObject)
    .pipe(first())
    .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
            this.error = error;
            this.loading = false;
        });
      }
  }
  registerUser2() {
    if (this.userObject.uname.trim() !== "" && this.userObject.upass.trim() !== "" && (this.userObject.upass.trim() === this.confirmPass))
      this._loginService.registerUser(this.userObject).subscribe((data) => {
        const result = data.body
        if (result['data']['status'] === 200) {
          this.errorMessage = result['data']['message'];
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
  }
}