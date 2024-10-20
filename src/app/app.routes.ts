import { Routes } from '@angular/router';
import { ItemEntryComponent } from './budget/pages/item-entry/item-entry.component';
import { DemoComponent } from './demo/demo.component';
import { loggedInGuard } from './auth/guards/logged-in.guard';

export const routes: Routes = [
//   { path: 'budget/item-entry', component: ItemEntryComponent, title: 'Entry' } //old

  // { path: 'budget', loadChildren: () => import('./budget/budget.routes') }, //new
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.routes'),
    canActivate: [loggedInGuard] // add new 2
  }, 
  { path: 'demo', component: DemoComponent},
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') } // add
];
