import { Component, ElementRef, inject, viewChild } from "@angular/core";
import { OrderListComponent } from "../order-list/order-list.component";
import { CartService } from "../../services/cart.service";
import { CurrencyPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-order",
  standalone: true,
  imports: [OrderListComponent, CurrencyPipe],
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.css",
})
export class OrderComponent {
  cartService = inject(CartService);
  overlayRef = viewChild<ElementRef<HTMLDivElement>>("overlay");
  http = inject(HttpClient);
  userEmail = localStorage.getItem("userEmail");

  hideOrderInfo() {
    this.cartService.showOrder.set(false);
  }

  clearCart() {
    this.cartService.showOrder.set(false);
    this.cartService.clearCart();

    this.cartService.submitOrder();
  }
}
