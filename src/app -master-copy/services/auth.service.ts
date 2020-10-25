import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError , BehaviorSubject } from 'rxjs';
import { retry} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import * as moment from "moment";
import { tap } from 'rxjs/operators';
import "rxjs/add/operator/map";
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('access_token'),
  })
};

@Injectable()
export class AuthenticationService {
  private apiUrl= ' http://localhost:1337/';

  public loggedIn :boolean;
  public isAuthenticated = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient,private router: Router) { }

  
  private setSession(authResult) {  
    const expiresAt = moment().add(authResult.expiresIn,'second');
    localStorage.setItem('access_token', authResult.idToken);
    localStorage.setItem('currentUser', authResult.userName);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  
}      
login(username: string, password: string): Observable<boolean> {
    return this.http.post<{userName:string, token: string, expiresIn:string}>(this.apiUrl+'login', {email: username, password: password})
      .pipe(
        retry(1),
        catchError(this.handleError),
        map(result => {
          this.isAuthenticated.next(true);          
          const expiresAt = moment().add(result['expiresIn'],'second');
          localStorage.setItem('access_token', result['data'].token);
          localStorage.setItem('currentUser', result['data']['user']['username']);
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
          return true;
        }),
        
      );
  }
  
  loginWithGoogleService(): Observable<any> {
    return this.http.get(this.apiUrl+'api/v1/auth/google').pipe(
      map((res: any) => res.json()),
      catchError(<T>(error: any, result?: T) => {
        console.log(error);
        return of(result as T);
      })
    );
  }

  loginAuth(username: string, password: string) {
    return this.http.post(this.apiUrl+'login', 
    { email: username, password: password }, 
    { observe: 'response'});
  }
  registerUser(userObj: any) {
    return this.http.post(this.apiUrl+'register', 
    { username: userObj.uname, email: userObj.uemail, password: userObj.upass }, 
    { observe: "response" });
  }
  signup(userObj: any): Observable<boolean> {
   // console.log(userObj);
    return this.http.post<{userName:string, token: string, expiresIn:string}>
    (this.apiUrl+'register', {username: userObj.uname, email: userObj.uemail, password: userObj.upass})
      .pipe(
        retry(1),
        catchError(this.handleError),
        map(result => {
      //    console.log(result);
          const expiresAt = moment().add(result.expiresIn,'second');
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('currentUser', result.userName);
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
          return true;
        }),
        
      );
  }
  
  logout(redirect: string) {
    localStorage.removeItem('access_token');
    localStorage.removeItem("expires_at");
    this.router.navigate([redirect]);
    this.isAuthenticated.next(false);
  }
  
  isLoggedIn() {
    if (localStorage.getItem('access_token')) {
      return this.loggedIn = true;
    }
  }
  public checkAuthenticated(){
    
    if (localStorage.getItem('access_token')!== null) {
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }
  
  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }    
// Error handling 
handleError(error) {
  let errorMessage = '';
  
  if(error.error instanceof ErrorEvent) {
  // Get client-side error
  errorMessage = error.error.message;

   
  } else {
   // console.log(error.error['code']);  
    //console.log(error.status);
  
  // Get server-side error
  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //console.log(error);
  if (error.error.message == 'Username not found' && error.status == 401){
        errorMessage = "User not found, please sign up.";
      }
  else if (error.error.message == 'Invalid Password' && error.status == 401){
        errorMessage = "Invalid Password!";
      }  
  else if (error.error['code'] == 'E_UNIQUE' && error.error['data'] == "userAlreadyInUse"){
    errorMessage = "User name already exist!";
  }
  else if (error.error['code'] == 'E_UNIQUE' && error.error['data'] == "emailAlreadyInUse"){
    errorMessage = "Email already exist!";
  }
  else if (error.error['code'] == 'E_UNIQUE' && error.error['data'] == "emailAlreadyInUse"){
    errorMessage = "Email already exist!";
  }
  else if (error.status == 409){
    errorMessage = "User name or Email address already used!";  
  }
    else{
      errorMessage = "Server Error";
      //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  //window.alert(errorMessage);
 
  return throwError(errorMessage);
  }
  
}
