import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.css']
})
export class RecipiesComponent implements OnInit {

  mobile: boolean;
  constructor() {
  }

  ngOnInit() {
    this.mobile = window.innerWidth < 992;
  }


  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth < 992) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
}
