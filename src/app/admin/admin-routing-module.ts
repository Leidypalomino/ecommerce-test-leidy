import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard'; // Importa el dashboard

const routes: Routes = [
  {
    path: '', // La ruta por defecto de /admin
    component: AdminDashboard,
    children: [
      // Aquí irán las rutas hijas para CRUD de productos, categorías, etc.
      // Por ejemplo:
      // { path: 'products', component: ProductCrudComponent },
      // { path: 'categories', component: CategoryManagementComponent },
      // { path: 'logs', component: AuditLogsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
