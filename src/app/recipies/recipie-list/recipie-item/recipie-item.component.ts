import { Component, Input} from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-recipie-item',
  templateUrl: './recipie-item.component.html',
  styleUrls: ['./recipie-item.component.css']
})
export class RecipieItemComponent {

  @Input() itemRecipe: Recipe;
  @Input() index: number;


  constructor() { }

}
