import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[] = [];
  private startEditing: Subject<number>;

  private shoppingListSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.shoppingListSubscription = this.shoppingListService.shoppingList.subscribe(
      (list: Ingredient[]) => {
        this.ingredients = list;
      }
    );
    this.ingredients = this.shoppingListService.getShoppingList();
    this.startEditing = this.shoppingListService.startEditing;
  }

  onEditItem(index: number) {
    this.startEditing.next(index);
  }

  ngOnDestroy(): void {
    this.shoppingListSubscription.unsubscribe();
    //this.startEditing.unsubscribe();
  }


}
