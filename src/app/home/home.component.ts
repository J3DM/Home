import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobile: boolean;
  constructor() { }

  ngOnInit() {
    this.mobile = window.innerWidth < 426;
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
