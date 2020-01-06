import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  subscription: Subscription;
  addItemForm: FormGroup;
  editedItemIndex = -1;
  editMode = false;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.addItemForm = new FormGroup({
      ingredientName: new FormControl(null, [Validators.required]),
      ingredientQuantity: new FormControl(0, [Validators.required, Validators.min(1)])
    });
    this.subscription = this.shoppingListService.startEditing.subscribe(
      (index: number) => {
        console.log('editComponent change destected ', index);
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.addItemForm.setValue({
          ingredientName: this.editedItem.name,
          ingredientQuantity: this.editedItem.amount
        });
      }
    );
  }

  addItemShoppingList() {
    const ingredient = new Ingredient(this.addItemForm.value.ingredientName, this.addItemForm.value.ingredientQuantity);
    if (this.editMode) {
      this.shoppingListService.updateItem(this.editedItemIndex, ingredient);
    } else {
      this.shoppingListService.addItem(ingredient);
    }
    this.resetAddItemForm();
  }

  onClear() {
    this.resetAddItemForm();
  }

  deleteItem() {
    this.shoppingListService.deleteItem(this.editedItemIndex);
    this.resetAddItemForm();
  }

  resetAddItemForm() {
    this.addItemForm.reset();
    this.editMode = false;
    this.editedItemIndex = -1;
  }
}
