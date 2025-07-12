import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { CartItem } from '../../../models/data.model';
import { ProductService } from '../../../services/product.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-list-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './order-list-item.component.html',
  styleUrl: './order-list-item.component.css',
})
export class OrderListItemComponent {
  cartItem = input<CartItem>();
  productService = inject(ProductService);

  get pictureSource() {
    return this.productService
      .data()
      .find((item) => item.name === this.cartItem()?.productName)?.image
      .desktop;
  }
}
