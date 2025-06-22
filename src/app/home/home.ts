// frontend/src/app/products/home/home.component.ts
import { Component, OnInit } from '@angular/core'; // Add OnInit if you need ngOnInit lifecycle hook
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  isAuthenticated = false;
  loading = true;
  loadingCategories = true;

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('token');

    this.http.get<any>('http://localhost:8080/api/categories').subscribe({
      next: (response) => {
        // Asigna una imagen por defecto a cada categoría
        this.mainCategories = (response.data || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          image: this.getCategoryImage(cat.slug)
        }));
        this.loadingCategories = false;
      },
      error: () => {
        this.mainCategories = [];
        this.loadingCategories = false;
      }
    });

    setTimeout(() => {
      this.featuredProducts = [
        { id: 1, name: 'Audífonos Bluetooth Pro', price: 49.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', discount: 10 },
        { id: 2, name: 'Smartwatch Serie 7', price: 89.99, category: 'Electrónica', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80', discount: 0 },
        { id: 3, name: 'Cámara Digital 4K', price: 120.00, category: 'Fotografía', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80', discount: 5 },
        { id: 4, name: 'Teclado Mecánico RGB', price: 69.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=300&q=80', discount: 15 }
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

  getCategoryImage(slug: string): string {
    const images: { [key: string]: string } = {
    electronicos: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80',
    celulares: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80',
    laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80',
    clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80',    'mens-clothing': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=100&q=80',
    'womens-clothing': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    accessories: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80',
    watches: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80',
    jewelry: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=100&q=80',
    books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=100&q=80'
    };
    return images[slug] || 'https://via.placeholder.com/100x100?text=Categoría';
  }
}