import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipie-search',
  templateUrl: './recipie-search.component.html',
  styleUrls: ['./recipie-search.component.css']
})
export class RecipieSearchComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  isAuthenticated: boolean;

  nameFilter = null;
  classifficationFilter = null;

  constructor(private recipeService: RecipeService,
              private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      (user) => {
        this.isAuthenticated = user != null;
      }
    );
  }


  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
   }

  search() {
    this.recipeService.filterRecipes(this.nameFilter, this.classifficationFilter);
  }

}
