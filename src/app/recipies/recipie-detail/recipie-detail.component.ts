import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { isNullOrUndefined } from 'util';
import { RecipeService } from 'src/app/services/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipie-detail',
  templateUrl: './recipie-detail.component.html',
  styleUrls: ['./recipie-detail.component.css']
})
export class RecipieDetailComponent implements OnInit {

  detailedRecipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = +params.id;
        this.detailedRecipe = this.recipeService.getRecipe(this.id);
      });
  }

  check() {
    return isNullOrUndefined(this.detailedRecipe);
  }

  addIngredientsToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.detailedRecipe.ingredients);
  }

  deleteRecipe() {
    this.recipeService.deleteRecipeWithIndex(this.id);
    this.router.navigate(['recipies']);
  }
}
