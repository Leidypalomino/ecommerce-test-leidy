import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, Pipes
import { RouterModule } from '@angular/router'; // Para routerLink

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, // El componente es standalone
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  totalSales: number = 0;
  productsInStock: number = 0;
  pendingOrders: number = 0;
  newUsersLast30Days: number = 0;
  topSellingProducts: { name: string; sales: number }[] = [];

  constructor() { }

  ngOnInit(): void {
    // Aquí es donde harías llamadas a tu backend para obtener las métricas reales.
    // Por ahora, simularemos los datos con un pequeño retraso.
    this.loadDashboardMetrics();
  }

  loadDashboardMetrics(): void {
    // Simula una llamada a la API con un retraso
    setTimeout(() => {
      this.totalSales = 125678.50;
      this.productsInStock = 5230;
      this.pendingOrders = 45;
      this.newUsersLast30Days = 128;
      this.topSellingProducts = [
        { name: 'Laptop Gamer XYZ', sales: 15200.00 },
        { name: 'Auriculares Bluetooth Pro', sales: 8900.50 },
        { name: 'Smartwatch UltraFit', sales: 7500.00 },
        { name: 'Cámara Mirrorless 4K', sales: 6200.00 },
        { name: 'Teclado Mecánico RGB', sales: 4800.75 },
      ];
      console.log('Dashboard metrics loaded.');
    }, 1000); // Simula 1 segundo de carga
  }
}
