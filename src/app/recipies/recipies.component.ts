import { Component, OnInit, HostListener } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.css']
})
export class RecipiesComponent implements OnInit {

  mobile: boolean;

  nameFilter = null;
  classifficationFilter = null;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.mobile = window.innerWidth < 992;
  }

  search() {
    this.recipeService.filterRecipes(this.nameFilter, this.classifficationFilter);
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
