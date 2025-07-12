import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderListItemComponent } from './order-list-item/order-list-item.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [OrderListItemComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent {
  cartItems = inject(CartService).items();
}
