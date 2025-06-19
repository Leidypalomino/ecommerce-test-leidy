import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts implements OnInit {
  products: Product[] = [];
  currentProduct!: Product; // Se inicializa en ngOnInit
  isEditing: boolean = false;
  nextId: number = 1;

  availableCategories: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes'];
  tempImages: { file: File, url: string }[] = [];

  constructor() { }

  ngOnInit(): void {
    this.currentProduct = this.getEmptyProduct(); // Inicialización segura aquí
    this.loadProducts();
  }

  // --- Métodos de CRUD (Simulados) ---

  loadProducts(): void {
    setTimeout(() => {
      this.products = this.generateDummyProducts(10);
      if (this.products.length > 0) {
        this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
      } else {
        this.nextId = 1;
      }
    }, 500);
  }

  saveProduct(): void {
    if (!this.currentProduct.name || !this.currentProduct.price || !this.currentProduct.category) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const newImageUrls = this.tempImages.map(img => img.url);

    if (this.isEditing) {
      const index = this.products.findIndex(p => p.id === this.currentProduct.id);
      if (index !== -1) {
        this.currentProduct.images = [...this.currentProduct.images, ...newImageUrls];
        this.products[index] = { ...this.currentProduct };
        alert('Producto actualizado con éxito!');
      }
    } else {
      this.currentProduct.id = this.nextId++;
      this.currentProduct.images = newImageUrls;
      this.products.push({ ...this.currentProduct });
      alert('Producto añadido con éxito!');
    }

    this.resetForm();
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.currentProduct = { ...product };
    this.tempImages = [];
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.products = this.products.filter(p => p.id !== id);
      alert('Producto eliminado.');
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.tempImages = [];
  }

  getEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: this.availableCategories[0] || '',
      images: [],
      inStock: true
    };
  }

  // --- Lógica de Drag & Drop para Imágenes ---

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900');

    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  private processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.tempImages.push({ file: file, url: e.target.result });
        };
        reader.readAsDataURL(file);
      } else {
        alert('Solo se permiten archivos de imagen.');
      }
    }
  }

  removeImage(index: number, isTemp: boolean): void {
    if (isTemp) {
      this.tempImages.splice(index, 1);
    } else {
      this.currentProduct.images.splice(index, 1);
    }
  }

  // --- Métodos de Simulación de Datos ---
  private generateDummyProducts(count: number): Product[] {
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes'];
    const products: Product[] = [];
    for (let i = 1; i <= count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      products.push({
        id: i,
        name: `Producto de Test ${i}`,
        description: `Breve descripción para el producto ${i}.`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        category: category,
        images: [`https://via.placeholder.com/150x150/${this.getRandomHexColor()}/FFFFFF?text=Prod+${i}`],
        inStock: Math.random() > 0.2,
      });
    }
    return products;
  }

  private getRandomHexColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
}