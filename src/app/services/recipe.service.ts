import { Injectable } from '@angular/core';

import { Recipe } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected =  new Subject<Recipe>();
  recipieList = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService,
              private http: HttpClient) {

  }

  recipies: Recipe[] = [];

  getRecipies() {
    return this.http.get<Recipe[]>(environment.firebasePath + '/recipes.json')
    .pipe(
      map(resultData => {
        let recipeArray = [];
        for (const key in resultData) {
          if (resultData.hasOwnProperty(key)) {
            recipeArray.push(
              new Recipe(
                resultData[key].name,
                resultData[key].classification,
                resultData[key].difficulty,
                resultData[key].description,
                resultData[key].imagePath,
                resultData[key].ingredients,
                key
              )
            );
          }
        }
        this.recipies = recipeArray;
        return recipeArray;
      })
    ).subscribe( result => this.recipieList.next(result));
  }

  addRecipe(newRecipe: Recipe) {
    this.http.post(environment.firebasePath + '/recipes.json', newRecipe)
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  editRecipeWithIndex(index: number, recipe: Recipe) {
    this.editRecipe(this.getRecipe(index).id, recipe);
  }

  editRecipe(id: string, recipe: Recipe) {
    delete recipe.id;
    this.http.patch(environment.firebasePath + '/recipes/' + id + '.json', recipe)
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  deleteRecipeWithIndex(index: number) {
    this.deleteRecipe(this.getRecipe(index).id, index);
  }

  deleteRecipe(id: string, index: number) {
    this.http.delete(environment.firebasePath + '/recipes/' + id + '.json')
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addItems(ingredients);
  }

  getRecipe(id: number) {
    return this.recipies[id];
  }
}
