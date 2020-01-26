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

  getRecipies(queryString: string = '') {
    return this.http.get<Recipe[]>(environment.firebasePath + '/recipes.json' + queryString)
    .pipe(
      map(resultData => {
        const recipeArray = [];
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

  filterRecipes(name: string, classification: string) {
    classification = classification === null ? '' : classification;
    name = name === null ? '' : name;
    if (name === '' && classification === '') {
      return this.getRecipies();
    }
    const queryString = '?orderBy="filter"&startAt="' + name.toUpperCase() + '"&endAt="' + name.toUpperCase() + '\uf8ff"';
    return this.getRecipies(queryString);
  }

  checkRecipeList(id: string) {
    return this.recipies.filter(recipe => recipe.id === id)[0];
  }

  getRecipe(id: string) {
    const listedRecipe = this.checkRecipeList(id);
    if (listedRecipe) {
      return this.recipeSelected.next(listedRecipe);
    }
    return this.http.get<Recipe>(environment.firebasePath + '/recipes/' + id + '.json')
    .pipe(
      map(resultData => {
        const recipe = new Recipe(
          resultData.name,
          resultData.classification,
          resultData.difficulty,
          resultData.description,
          resultData.imagePath,
          resultData.ingredients,
          id
        );
        return recipe;
      })
    ).subscribe( result => this.recipeSelected.next(result));
  }

  addRecipe(newRecipe: Recipe) {
    newRecipe.filter = (newRecipe.name).toUpperCase();
    this.http.post(environment.firebasePath + '/recipes.json', newRecipe)
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  editRecipeWithIndex(index: number, recipe: Recipe) {
    this.editRecipe(this.getIndexRecipe(index).id, recipe);
  }

  editRecipe(id: string, recipe: Recipe) {
    delete recipe.id;
    recipe.filter = (recipe.name).toUpperCase();
    this.http.patch(environment.firebasePath + '/recipes/' + id + '.json', recipe)
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  deleteRecipeWithIndex(index: number) {
    this.deleteRecipe(this.getIndexRecipe(index).id);
  }

  deleteRecipe(id: string) {
    this.http.delete(environment.firebasePath + '/recipes/' + id + '.json')
    .subscribe( result => {
        this.getRecipies();
      }
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addItems(ingredients);
  }

  getIndexRecipe(id: number) {
    return this.recipies[id];
  }
}
