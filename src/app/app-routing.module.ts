import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, // Redirige la raíz a la página de login
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  // Aquí irán otras rutas más adelante, como la de productos
  // { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  // Ruta comodín para cualquier otra URL no encontrada
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }