import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  loginAction = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)])
      }
    );
  }

  apiResponseReceived(error: string = null) {
    this.isLoading = !this.isLoading;
    this.error = null;
    this.error = error;
  }

  onSubmit() {
    let authObs: Observable<AuthResponseData>;
    if (this.loginForm.valid) {
      this.isLoading = !this.isLoading;
      if (!this.loginAction) {
        authObs = this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
      } else {
        authObs = this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      }
    }
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.apiResponseReceived();
        this.router.navigate(['/recipies']);
      },
      error => {
        this.error = error;
        this.apiResponseReceived(error);
      }
    );
    this.loginForm.reset();
  }

  switchForm() {
    this.loginAction = !this.loginAction;
  }
}
