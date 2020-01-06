import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  shoppingList = new Subject<Ingredient[]>();
  startEditing = new Subject<number>();

  private list: Ingredient[] = [];

  getShoppingList() {
    return this.list.slice();
  }

  addItem(ingredient: Ingredient) {
    let foundIngredient = null;
    foundIngredient = this.list.filter((item) => item.name === ingredient.name);
    console.log(foundIngredient.length);
    if (foundIngredient.length > 0) {
      this.list.map((item) => {
        if (item.name === ingredient.name) {
          item.amount += ingredient.amount;
        }
      });
    } else {
      this.list.push(ingredient);
    }
    this.shoppingList.next(this.getShoppingList());
  }

  updateItem(index: number, ingredient: Ingredient) {
    this.list[index] = ingredient;
    this.shoppingList.next(this.getShoppingList());
  }

  addItems(ingredients: Ingredient[]) {
    ingredients.forEach( ingredient => this.addItem(ingredient));
    this.shoppingList.next(this.getShoppingList());
  }

  getIngredient(index: number) {
    return this.list[index];
  }

  startedEditing(index: number) {
    return this.getIngredient(index);
  }

  deleteItem(index: number) {
    this.list.splice(index, 1);
    this.shoppingList.next(this.getShoppingList());
  }
}
