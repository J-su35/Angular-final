import { Routes } from '@angular/router';
import { ItemEntryComponent } from './pages/item-entry/item-entry.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemApprovalComponent } from './pages/item-approval/item-approval.component';
import { rolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/models/logged-in-user';
import { canDeactivateGuard } from '../auth/guards/can-deactivate.guard';

export const routes: Routes = [
  { path: 'item-entry', component: ItemEntryComponent, title: 'Entry' },
  // { path: 'item-add', component: ItemFormComponent, title: 'Add' }, // old
  { path: 'item-add', component: ItemFormComponent, title: 'Add', canDeactivate: [canDeactivateGuard] }, // new
  // { path: 'item-edit/:id', component: ItemFormComponent, title: 'Edit' }, //old
  { path: 'item-edit/:id', component: ItemFormComponent, title: 'Edit', canActivate: [rolesGuard([Role.ADMIN, Role.MANAGER])] }, //new
  // { path: 'item-approval', component: ItemApprovalComponent, title: 'Approval' } //old
  // new
  {
    path: 'item-approval',
    component: ItemApprovalComponent,
    title: 'Approval',
    canActivate: [rolesGuard([Role.ADMIN, Role.MANAGER])] // add
  } 
];

export default routes;
