import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Ingredient } from 'src/app/models/ingredient.model';
import { Recipe } from 'src/app/models/recipe.model';
import { Description } from 'src/app/models/description.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeForm: FormGroup;
  recipeName = '';
  editMode = false;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
        this.editMode = params.id != null;
        this.initForm();      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeClassification = '';
    let recipeDifficulty = 0;
    let recipeImage = '';
    const recipeDescription = new FormArray([]);
    const ingredientList = new FormArray([]);

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipe(this.id);

      recipeName = recipe.name;
      recipeImage = recipe.imagePath;
      recipeClassification = recipe.classification;
      recipeDifficulty = recipe.difficulty;


      if (recipe.description) {
        recipe.description.forEach(
          (description: Description) => {
            recipeDescription.push(
              new FormGroup(
                {
                  step: new FormControl(description.step)
                }
              )
            );
          }
        );
      }

      if (recipe.ingredients) {
        recipe.ingredients.forEach(
          (ingredient: Ingredient) => {
            ingredientList.push(
              new FormGroup(
                {
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [Validators.required, Validators.min(1)])
                }
              )
            );
          }
        );
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImage, Validators.required),
      difficulty: new FormControl(recipeDifficulty, [Validators.min(0), Validators.max(3)]),
      classification: new FormControl(recipeClassification),
      description: recipeDescription,
      ingredients: ingredientList
    });
  }

  get formControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  get descriptionControls() {
    return (this.recipeForm.get('description') as FormArray).controls;
  }

  addDescription() {
    const descriptionFormArray = this.recipeForm.get('description') as FormArray;
    descriptionFormArray.push(
      new FormGroup({
        step: new FormControl(null)
      })
    );
  }

  addIngredient() {
    const ingredientFormArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientFormArray.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.min(1)])
      })
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.editRecipeWithIndex( this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['recipies']);
  }

  onDelete() {
    this.recipeService.deleteRecipeWithIndex(this.id);
    this.router.navigate(['recipies']);
  }

  onDeleteDescription(index: number) {
    (this.recipeForm.get('description') as FormArray).removeAt(index);
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  clearIngredients() {
    (this.recipeForm.get('ingredients') as FormArray).clear();
  }
}
