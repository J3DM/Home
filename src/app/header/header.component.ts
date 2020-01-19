import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  collapsed = true;
  userAuthenticated = false;
  private userSub: Subscription;
  mobile: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe( user => {
      this.userAuthenticated = !user ? false : true;
    });
    this.mobile = window.innerWidth < 426;
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
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
