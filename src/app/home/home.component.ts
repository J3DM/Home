import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userAuthenticated: User;
  mobile: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.mobile = window.innerWidth < 426;
    this.authService.user.subscribe( user => {
      this.userAuthenticated = user;
    });
  }

  logout(){
    this.authService.logout();
  }

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth < 426) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
}
