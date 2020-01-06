import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

export interface AuthResponseData {
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
  }

  signIn(formEmail: string, formPassword: string) {
    const singInData = {
      email: formEmail,
      password: formPassword,
      returnSecureToken: true
    };
    return this.http.post<AuthResponseData>(environment.firebaseAuthSingIn, singInData)
    .pipe(
      catchError(errResponse => this.handleError(errResponse)),
      tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  login(formEmail: string, formPassword: string) {
    const loginData = {
      email: formEmail,
      password: formPassword,
      returnSecureToken: true
    };
    return this.http.post<AuthResponseData>(environment.firebaseAuthLogIn, loginData)
    .pipe(
      catchError(errResponse => this.handleError(errResponse)),
      tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = (new Date()).setDate(new Date().getDate() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred!';
    if (errResponse.error || errResponse.error.error) {
      switch (errResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid or the user does not have a password.';
          break;
        case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator.';
          break;
        default:
          errorMessage = 'Unknown error occurred while processing the login request';
          break;
      }
    }
    return throwError(errorMessage);
  }
}



