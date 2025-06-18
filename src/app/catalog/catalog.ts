import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { debounceTime, Subject } from 'rxjs'; // Para debounce
import { takeUntil } from 'rxjs/operators'; // Para gestionar suscripciones
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number; // 1-5 estrellas
  reviews: number;
}

// Definición de la interfaz de Categoría para filtros
interface CategoryFilter {
  name: string;
  count: number;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})

export class Catalog implements OnInit, OnDestroy, AfterViewInit {
  viewMode: 'grid' | 'list' = 'grid'; // 'grid' o 'list'
  showFiltersMobile: boolean = false; // Controla la visibilidad del sidebar en móviles

  // --- Propiedades de Filtros ---
  searchTerm: string = '';
  private searchSubject = new Subject<string>(); // Para debounce
  selectedCategories: string[] = [];
  availableCategories: CategoryFilter[] = []; // Se llenará dinámicamente
  minPrice: number = 0;
  maxPrice: number = 1000;
  inStockOnly: boolean = false;
  minRating: number = 0; // Para el filtro de calificación

  // --- Propiedades de Ordenamiento ---
  sortBy: string = 'nameAsc'; // Opciones: 'nameAsc', 'nameDesc', 'priceAsc', 'priceDesc', 'ratingDesc'

  // --- Propiedades de Productos y Paginación/Infinite Scroll ---
  allProducts: Product[] = []; // Todos los productos (simulados)
  filteredProducts: Product[] = []; // Productos después de aplicar filtros y ordenamiento
  displayedProducts: Product[] = []; // Productos mostrados en la vista actual (para paginación/infinite scroll)

  // Opciones de Paginación/Infinite Scroll
  useInfiniteScroll: boolean = true; // Cambiar a false para usar paginación
  currentPage: number = 1;
  productsPerPage: number = 8; // Cuántos productos cargar por página/scroll
  totalPages: number = 1;
  loading: boolean = false; // Estado de carga para skeleton loaders
  noMoreProducts: boolean = false; // Indica si no hay más productos para cargar con infinite scroll

  private destroy$ = new Subject<void>(); // Para desuscribirse al destruir el componente

  // Referencia al elemento trigger de infinite scroll
  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer!: IntersectionObserver;

  // --- Quick View Modal ---
  showQuickViewModal: boolean = false;
  selectedProductForQuickView: Product | null = null;


  constructor() {
    // Simulamos una carga inicial de productos
    this.loading = true;
    setTimeout(() => {
      this.allProducts = this.generateDummyProducts(50); // Genera 50 productos de ejemplo
      this.populateCategories(); // Llena las categorías y sus conteos
      this.applyFiltersAndSorting(); // Aplica filtros iniciales
      this.loading = false;
    }, 1000); // Simula 1 segundo de carga
  }

  ngOnInit(): void {
    // Configura el debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de la última pulsación
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFiltersAndSorting();
    });
  }

  ngAfterViewInit(): void {
    if (this.useInfiniteScroll) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // --- Métodos de UI ---
  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleFiltersMobile(): void {
    this.showFiltersMobile = !this.showFiltersMobile;
  }

  // --- Métodos de Filtro ---
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  toggleCategory(categoryName: string): void {
    const index = this.selectedCategories.indexOf(categoryName);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryName);
    }
    this.applyFiltersAndSorting();
  }

  applyFilters(): void {
    // Si usas paginación, resetea a la primera página
    if (!this.useInfiniteScroll) {
      this.currentPage = 1;
    }
    this.applyFiltersAndSorting();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategories = [];
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.inStockOnly = false;
    this.minRating = 0;
    this.applyFiltersAndSorting();
  }

  // --- Métodos de Ordenamiento ---
  applySorting(): void {
    this.applyFiltersAndSorting();
  }

  // --- Lógica Principal de Filtros y Ordenamiento ---
  private applyFiltersAndSorting(): void {
    // Simular carga para mostrar skeleton loaders si los tuvieras
    this.loading = true;
    setTimeout(() => { // Simula un retraso para la carga/filtrado
      let tempProducts = [...this.allProducts]; // Copia de todos los productos

      // 1. Aplicar búsqueda
      if (this.searchTerm) {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
        tempProducts = tempProducts.filter(p =>
          p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          p.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      // 2. Aplicar filtros de categoría
      if (this.selectedCategories.length > 0) {
        tempProducts = tempProducts.filter(p => this.selectedCategories.includes(p.category));
      }

      // 3. Aplicar filtro de precio
      tempProducts = tempProducts.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

      // 4. Aplicar filtro de disponibilidad
      if (this.inStockOnly) {
        tempProducts = tempProducts.filter(p => p.inStock);
      }

      // 5. Aplicar filtro de calificación
      if (this.minRating > 0) {
        tempProducts = tempProducts.filter(p => p.rating >= this.minRating);
      }

      // 6. Aplicar ordenamiento
      switch (this.sortBy) {
        case 'nameAsc':
          tempProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          tempProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'priceAsc':
          tempProducts.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          tempProducts.sort((a, b) => b.price - a.price);
          break;
        case 'ratingDesc':
          tempProducts.sort((a, b) => b.rating - a.rating);
          break;
      }

      this.filteredProducts = tempProducts;

      // Resetear paginación/infinite scroll
      if (this.useInfiniteScroll) {
        this.displayedProducts = []; // Reinicia los productos mostrados
        this.currentPage = 0; // Se incrementará en loadMoreProducts
        this.noMoreProducts = false;
        this.loadMoreProducts(); // Carga la primera "página"
      } else {
        this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        this.updateDisplayedProductsForPagination();
      }
      this.loading = false;
    }, 300); // Pequeño retraso para simular el procesamiento de filtros
  }

  // --- Lógica de Paginación ---
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProductsForPagination();
    }
  }

  private updateDisplayedProductsForPagination(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // --- Lógica de Infinite Scroll ---
  private setupInfiniteScroll(): void {
    const options = {
      root: null, // El viewport es el root
      rootMargin: '0px',
      threshold: 0.1 // Cargar cuando el 10% del trigger sea visible
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.loading && !this.noMoreProducts) {
        this.loadMoreProducts();
      }
    }, options);

    if (this.scrollTrigger) {
      this.observer.observe(this.scrollTrigger.nativeElement);
    }
  }

  private loadMoreProducts(): void {
    if (this.loading || this.noMoreProducts) {
      return;
    }

    this.loading = true;
    setTimeout(() => { // Simula la carga asíncrona de datos
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;

      const newProducts = this.filteredProducts.slice(startIndex, endIndex);
      this.displayedProducts = [...this.displayedProducts, ...newProducts];

      if (this.displayedProducts.length >= this.filteredProducts.length) {
        this.noMoreProducts = true;
      }
      this.loading = false;
    }, 800); // Simula un tiempo de carga para los "nuevos" productos
  }


  // --- Quick View Modal ---
  openQuickView(product: Product): void {
    this.selectedProductForQuickView = { ...product,
      description: 'Esta es una descripción detallada del producto que aparecería en el modal de vista rápida. Aquí puedes poner más información, especificaciones técnicas, etc. La idea es que el usuario pueda ver los detalles sin navegar a una página de producto completa.' // Descripción extendida
    };
    this.showQuickViewModal = true;
  }

  closeQuickView(): void {
    this.showQuickViewModal = false;
    this.selectedProductForQuickView = null;
  }

  // --- Métodos de Simulación de Datos ---
  private generateDummyProducts(count: number): Product[] {
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Comida', 'Accesorios'];
    const products: Product[] = [];
    for (let i = 1; i <= count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      products.push({
        id: i,
        name: `Producto de Ejemplo ${i}`,
        description: `Esta es la descripción del producto ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)), // Precio entre 10 y 110
        category: category,
        image: `https://via.placeholder.com/400x300/${this.getRandomHexColor()}/FFFFFF?text=Product+${i}`,
        inStock: Math.random() > 0.2, // 80% de probabilidad de estar en stock
        rating: Math.floor(Math.random() * 5) + 1, // Calificación de 1 a 5
        reviews: Math.floor(Math.random() * 200) + 5 // Entre 5 y 205 reseñas
      });
    }
    return products;
  }

  private getRandomHexColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  private populateCategories(): void {
    const categoryMap = new Map<string, number>();
    this.allProducts.forEach(product => {
      categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
    });
    this.availableCategories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  }
}
