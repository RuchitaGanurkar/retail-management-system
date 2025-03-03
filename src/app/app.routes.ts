import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryCreateComponent } from './components/inventory/inventory-create/inventory-create.component';
import { InventoryEditComponent } from './components/inventory/inventory-edit/inventory-edit.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { LoginComponent } from './components/login/login.component';
import { SalesListComponent } from './components/sales/sales-list/sales-list.component';
import { SalesReportComponent } from './components/sales/sales-report/sales-report.component';
import { SupplierEditComponent } from './components/supplier/supplier-edit/supplier-edit.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { SupplierViewComponent } from './components/supplier/supplier-view/supplier-view.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'supplier',
    children: [
      { path: '', component: SupplierListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } },
      { path: 'view/:id', component: SupplierViewComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager', 'supplier'] } },
      { path: 'edit/:id', component: SupplierEditComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager', 'supplier'] } }
    ]
  },
  {
    path: 'sales',
    children: [
      { path: '', component: SalesListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } },
      { path: 'report', component: SalesReportComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } }
    ]
  },
  {
    path: 'inventory',
    children: [
      { path: '', component: InventoryListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } },
      { path: 'create', component: InventoryCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } },
      { path: 'edit/:id', component: InventoryEditComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } },
      { path: 'delete/:id', component: InventoryListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager'] } }
    ]
  }
];