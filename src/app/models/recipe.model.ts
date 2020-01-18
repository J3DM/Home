import { Ingredient } from './ingredient.model';
import { Description } from './description.model';

export class Recipe {

  public id: string;
  public name: string;
  public classification: string;
  public difficulty: number;
  public description: Description[];
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(
        name: string,
        classification: string,
        difficulty: number,
        description: Description[],
        imagePath: string,
        ingredients: Ingredient[],
        key: string= '') {
    this.id = key;
    this.name = name;
    this.classification = classification;
    this.difficulty = difficulty;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }

}
