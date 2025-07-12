import { Component, inject, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyPipe } from '@angular/common';
import { OrderComponent } from '../order/order/order.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);

  showOrder() {
    this.cartService.showOrder.set(true);
  }
}
