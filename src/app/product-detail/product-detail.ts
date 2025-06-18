import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // Importa Router para obtener la URL actual
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)] del selector de cantidad
import { Title, Meta } from '@angular/platform-browser'; // Para Meta tags de SEO
import { Subscription } from 'rxjs';

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string; // Descripción más larga para el detalle
  price: number;
  oldPrice?: number; // Precio anterior para ofertas
  category: string;
  images: string[]; // Array de URLs de imágenes
  inStock: boolean;
  rating: number;
  reviews: number;
  sku: string; // Stock Keeping Unit
  brand: string;
}

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit, OnDestroy {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  mainImage: string = ''; // Imagen principal mostrada en la galería
  loading: boolean = true; // Para simular carga

  // Propiedades para el zoom de imagen
  zoomScale: number = 1.0;
  zoomX: number = 0;
  zoomY: number = 0;
  @ViewChild('mainImageContainer') mainImageContainer!: ElementRef;

  // Para compartir en redes sociales
  currentProductUrl: string = '';

  private routeSub!: Subscription;
  private productsData: Product[] = []; // Base de datos de productos simulada

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inyecta Router
    private titleService: Title, // Inyecta Title
    private metaService: Meta // Inyecta Meta
  ) {
    this.productsData = this.generateDummyProducts(20); // Genera 20 productos para la simulación
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.product = undefined;
        this.loading = false;
      }
    });
    this.currentProductUrl = window.location.href; // Obtiene la URL actual del navegador
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.product = undefined; // Limpia el producto anterior
    this.mainImage = ''; // Limpia la imagen principal

    setTimeout(() => { // Simula una llamada API
      const foundProduct = this.productsData.find(p => p.id === id);

      if (foundProduct) {
        this.product = foundProduct;
        this.mainImage = foundProduct.images[0] || ''; // Establece la primera imagen como principal
        this.loadRelatedProducts(foundProduct.category, foundProduct.id);
        this.setMetaTags(foundProduct); // Configura las meta tags
      }
      this.loading = false;
    }, 800); // Retraso para simular carga
  }

  private loadRelatedProducts(category: string, currentProductId: number): void {
    this.relatedProducts = this.productsData
      .filter(p => p.category === category && p.id !== currentProductId) // Filtra por categoría y excluye el actual
      .sort(() => 0.5 - Math.random()) // Orden aleatorio
      .slice(0, 4); // Toma 4 productos relacionados
  }

  private setMetaTags(product: Product): void {
    this.titleService.setTitle(`${product.name} - Ecommerce Test`);
    this.metaService.updateTag({ name: 'description', content: product.description });
    this.metaService.updateTag({ name: 'keywords', content: `${product.name}, ${product.category}, ${product.brand}, Ecommerce Test` });
    this.metaService.updateTag({ property: 'og:title', content: product.name });
    this.metaService.updateTag({ property: 'og:description', content: product.description });
    this.metaService.updateTag({ property: 'og:image', content: product.images[0] });
    this.metaService.updateTag({ property: 'og:url', content: this.currentProductUrl });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: product.name });
    this.metaService.updateTag({ name: 'twitter:description', content: product.description });
    this.metaService.updateTag({ name: 'twitter:image', content: product.images[0] });
  }

  // --- Galería de Imágenes y Zoom ---
  setMainImage(image: string): void {
    this.mainImage = image;
    this.resetZoom(); // Resetear zoom al cambiar de imagen
  }

  handleMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    this.zoomScale = 2.5; // Factor de zoom
    this.zoomX = (x - 0.5) * -100 * (this.zoomScale - 1) / this.zoomScale; // Ajuste para centrar el zoom
    this.zoomY = (y - 0.5) * -100 * (this.zoomScale - 1) / this.zoomScale;
  }

  resetZoom(): void {
    this.zoomScale = 1.0;
    this.zoomX = 0;
    this.zoomY = 0;
  }

  // --- Selector de Cantidad ---
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // --- Añadir al Carrito (simulado) ---
  addToCart(): void {
    if (this.product && this.product.inStock && this.quantity > 0) {
      console.log(`Añadido al carrito: ${this.quantity} x ${this.product.name}`);
      alert(`¡${this.quantity} de "${this.product.name}" añadidos al carrito!`);
      // Aquí se integraría la lógica real del carrito de compras
    } else {
      console.warn('No se puede añadir al carrito: producto agotado o cantidad inválida.');
      alert('No se pudo añadir al carrito. Verifica la disponibilidad y cantidad.');
    }
  }

  // --- Métodos de Simulación de Datos ---
  private generateDummyProducts(count: number): Product[] {
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes'];
    const products: Product[] = [];
    for (let i = 1; i <= count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const hasOldPrice = Math.random() > 0.5;
      const price = parseFloat((Math.random() * 100 + 10).toFixed(2));
      const oldPrice = hasOldPrice ? parseFloat((price * (1 + Math.random() * 0.5)).toFixed(2)) : undefined; // Precio 0-50% más alto
      const images = [
        `https://via.placeholder.com/600x400/${this.getRandomHexColor()}/FFFFFF?text=Product+${i}`,
        `https://via.placeholder.com/600x400/${this.getRandomHexColor()}/FFFFFF?text=Product+${i}+B`,
        `https://via.placeholder.com/600x400/${this.getRandomHexColor()}/FFFFFF?text=Product+${i}+C`,
      ];

      products.push({
        id: i,
        name: `Super Producto ${i}`,
        description: `Un breve resumen de este fantástico producto ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        longDescription: `Esta es una descripción mucho más detallada del Super Producto ${i}. Aquí podrías incluir todas las especificaciones técnicas, beneficios, características únicas y cualquier otra información relevante para el cliente. Es importante ser conciso pero informativo. Además, podrías añadir listas, tablas, etc. para mejorar la legibilidad.`,
        price: price,
        oldPrice: oldPrice,
        category: category,
        images: images,
        inStock: Math.random() > 0.15, // 85% de probabilidad de estar en stock
        rating: Math.floor(Math.random() * 5) + 1,
        reviews: Math.floor(Math.random() * 200) + 10,
        sku: `SKU-${1000 + i}`,
        brand: `Marca XYZ`
      });
    }
    return products;
  }

  private getRandomHexColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
}
