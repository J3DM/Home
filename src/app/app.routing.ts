import { NgModule } from '@angular/core';
import { RecipiesComponent } from './recipies/recipies.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { Routes, RouterModule } from '@angular/router';
import { RecipeStartComponent } from './recipies/recipe-start/recipe-start.component';
import { RecipieDetailComponent } from './recipies/recipie-detail/recipie-detail.component';
import { RecipeEditComponent } from './recipies/recipe-edit/recipe-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipies', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, pathMatch: 'full' },
  { path: 'recipies', component: RecipiesComponent, canActivate: [AuthGuard], children: [
    {path: '', component: RecipeStartComponent},
    {path: 'new', component: RecipeEditComponent},
    {path: ':id', component: RecipieDetailComponent},
    {path: ':id/edit', component: RecipeEditComponent}
  ]},
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
