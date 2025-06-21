// frontend/src/app/products/home/home.component.ts
import { Component, OnInit } from '@angular/core'; // Add OnInit if you need ngOnInit lifecycle hook
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  isAuthenticated = false;
  loading = true;
  
  featuredProducts: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    discount: number;
  }[] = [];

  mainCategories: {
    id: number;
    name: string;
    image: string;
  }[] = [];

  mostViewedProducts: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    isNew: boolean;
  }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('token');

    setTimeout(() => {
      this.featuredProducts = [
        { id: 1, name: 'Audífonos Bluetooth Pro', price: 49.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', discount: 10 },
        { id: 2, name: 'Smartwatch Serie 7', price: 89.99, category: 'Electrónica', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80', discount: 0 },
        { id: 3, name: 'Cámara Digital 4K', price: 120.00, category: 'Fotografía', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80', discount: 5 },
        { id: 4, name: 'Teclado Mecánico RGB', price: 69.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=300&q=80', discount: 15 }
      ];
      this.mainCategories = [
        { id: 1, name: 'Tecnología', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80' },
        { id: 2, name: 'Moda', image: 'https://images.unsplash.com/photo-1523381294911-8d3cead29864?auto=format&fit=crop&w=100&q=80' },
        { id: 3, name: 'Hogar', image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=100&q=80' },
        { id: 4, name: 'Deportes', image: 'https://images.unsplash.com/photo-1517782352210-9b4822003c4c?auto=format&fit=crop&w=100&q=80' },
        { id: 5, name: 'Juguetes', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80' }
      ];
      this.mostViewedProducts = [
        { id: 5, name: 'Laptop Gamer Ultrabook', price: 999.99, category: 'Computadoras', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', isNew: true },
        { id: 6, name: 'Zapatillas Running Pro', price: 59.99, category: 'Calzado', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80', isNew: false },
        { id: 7, name: 'Silla Ergonómica Premium', price: 150.00, category: 'Muebles', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80', isNew: true },
        { id: 8, name: 'Smart TV 65 pulgadas', price: 399.99, category: 'Electrónica', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=300&q=80', isNew: false }
      ];
      this.loading = false; // <-- Oculta los skeletons y muestra los datos reales
    }, 1500);
  }
}