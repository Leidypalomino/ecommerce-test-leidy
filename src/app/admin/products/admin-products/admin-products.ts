import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-products',
  imports: [],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts {
  product = {
    name: '',
    price: 0,
    images: [] as string[],
    // ...otros campos según tu modelo
  };
  
  dropImage(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.product.images, event.previousIndex, event.currentIndex);
  }
}
