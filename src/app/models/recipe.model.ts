import { Ingredient } from './ingredient.model';

export class Recipe {

  private id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[], key: string= '') {
    this.id = key;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }

  setId(key: string) {
    this.id = key;
  }

  getId() {
    return this.id;
  }

}
