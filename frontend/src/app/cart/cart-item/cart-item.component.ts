import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../models/data.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  cartItem = input<CartItem>();
  cartService = inject(CartService);

  removeItem(productName: string) {
    const element = this.cartService.findElement(productName);
    if (element) {
      element.active = false;
    }
    this.cartService.removeItem(productName);
  }
}
