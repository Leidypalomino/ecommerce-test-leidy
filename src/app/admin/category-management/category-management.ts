import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.scss'
})
export class CategoryManagement implements OnInit {
  categories: Category[] = []; // Lista de todas las categorías
  currentCategory: Category = this.getEmptyCategory(); // Categoría para el formulario (añadir/editar)
  isEditing: boolean = false; // Indica si estamos editando o añadiendo
  nextId: number = 1; // Para simular IDs autoincrementables

  constructor() { }

  ngOnInit(): void {
    this.loadCategories();
  }

  // --- Métodos de CRUD (Simulados) ---

  loadCategories(): void {
    // Simula la carga de categorías desde una API o base de datos
    setTimeout(() => {
      this.categories = this.generateDummyCategories(5); // Genera 5 categorías de ejemplo
      if (this.categories.length > 0) {
        this.nextId = Math.max(...this.categories.map(c => c.id)) + 1;
      } else {
        this.nextId = 1;
      }
    }, 500);
  }

  saveCategory(): void {
    if (!this.currentCategory.name) {
      alert('Por favor, ingresa el nombre de la categoría.');
      return;
    }

    if (this.isEditing) {
      // Editar categoría existente
      const index = this.categories.findIndex(c => c.id === this.currentCategory.id);
      if (index !== -1) {
        this.categories[index] = { ...this.currentCategory }; // Copia para evitar mutaciones directas si se cancela
        alert('Categoría actualizada con éxito!');
      }
    } else {
      // Añadir nueva categoría
      this.currentCategory.id = this.nextId++;
      this.categories.push({ ...this.currentCategory });
      alert('Categoría añadida con éxito!');
    }

    this.resetForm();
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategory = { ...category }; // Crea una copia para editar
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categories = this.categories.filter(c => c.id !== id);
      alert('Categoría eliminada.');
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentCategory = this.getEmptyCategory();
    this.isEditing = false;
  }

  getEmptyCategory(): Category {
    return {
      id: 0,
      name: '',
      description: ''
    };
  }

  // --- Métodos de Simulación de Datos ---
  private generateDummyCategories(count: number): Category[] {
    const categories: Category[] = [];
    const categoryNames = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
    for (let i = 1; i <= count; i++) {
      const name = categoryNames[i - 1] || `Categoría ${i}`;
      categories.push({
        id: i,
        name: name,
        description: `Descripción de la categoría ${name}.`
      });
    }
    return categories;
  }
}
