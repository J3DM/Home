import { Injectable } from '@angular/core';

import { Recipe } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, exhaustMap, take } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected =  new Subject<Recipe>();
  recipieList = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService,
              private http: HttpClient,
              private authService: AuthService) {

  }

  private recipies: Recipe[] = [
    new Recipe('A test recipie One', 'This is a recipie test', 'http://lorempixel.com/400/200/food',
     [new Ingredient('abc', 1), new Ingredient('def', 1)]),
    new Recipe('A test recipie Two', 'This is a recipie test', 'http://lorempixel.com/400/200/food',
     [new Ingredient('abc', 1)])
  ];

  getRecipies() {
    return this.http.get<Recipe[]>(environment.firebasePath + '/recipes.json')
    .pipe(
      map(resultData => {
        var recipeArray = [];
        for (const key in resultData) {
          if (resultData.hasOwnProperty(key)) {
            recipeArray.push(
              new Recipe(
                resultData[key].name,
                resultData[key].description,
                resultData[key].imagePath,
                resultData[key].ingredients,
                key
              )
            );
          }
        }
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

  editRecipe(index: number, recipe: Recipe) {
    this.recipies[index] = recipe;
    this.getRecipies();
  }

  deleteRecipe(index: number) {
    this.recipies.splice(index, 1);
    this.getRecipies();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addItems(ingredients);
  }

  getRecipe(id: number) {
    return this.recipies[id];
  }
}
