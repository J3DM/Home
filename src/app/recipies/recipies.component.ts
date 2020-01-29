import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipies',
  templateUrl: './recipies.component.html',
  styleUrls: ['./recipies.component.css']
})
export class RecipiesComponent implements OnInit, OnDestroy {

  mobile: boolean;

  nameFilter = null;
  classifficationFilter = null;
  authSubscription: Subscription;
  authenticated: boolean;

  constructor(private recipeService: RecipeService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.mobile = window.innerWidth < 992;
    this.authSubscription = this.authService.user.subscribe(
      (user) => {
        this.authenticated = user != null;
      }
    );
  }

  ngOnDestroy(): void {
   this.authSubscription.unsubscribe();
  }

  search() {
    this.recipeService.filterRecipes(this.nameFilter, this.classifficationFilter);
  }

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth < 992) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }
}
