import { Component, inject, input, signal } from '@angular/core';
import { Data, DataType } from '../../models/data.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  products = input<Data>();
  cartService = inject(CartService);
  quantityCount = signal(1);

  changeAction(productName: string) {
    if (!this.products()?.active) {
      this.cartService.addItem(productName);
      this.quantityCount.set(this.cartService.getQuantity(productName));
      this.products()!.active = true;
    } else if (!this.quantityCount()) {
      this.products()!.active = false;
      this.quantityCount.set(0);
    }
  }

  handleClick(data: DataType) {
    this.cartService.changeItemQuantity(data);
    this.quantityCount.set(this.cartService.getQuantity(data.productName));
  }
}
