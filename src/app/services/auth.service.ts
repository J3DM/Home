import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

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
  tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {
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

  autoLogin() {
    const storageUser: {id: string, _token: string, _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('J3DM-Home'));
    if (!storageUser) {
      return;
    }
    const loadedUser = new User('', storageUser.id, storageUser._token, + new Date(storageUser._tokenExpirationDate));
    if (loadedUser.token) {
      const expirationTime = new Date(storageUser._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
      this.user.next(loadedUser);
    }
    return;
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

  logout() {
    this.user.next(null);
    localStorage.removeItem('J3DM-Home');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => {
        this.logout();
      }
      , expirationDuration
    );

  }

  private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = (new Date()).setDate(new Date().getDate() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    delete user.email;
    localStorage.setItem('J3DM-Home', JSON.stringify(user));
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



