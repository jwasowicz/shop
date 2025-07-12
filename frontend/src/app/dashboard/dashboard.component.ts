import { Component, inject } from "@angular/core";
import { CartService } from "../services/cart.service";
import { HeaderComponent } from "../header/header.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { CartComponent } from "../cart/cart.component";
import { OrderComponent } from "../order/order/order.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    HeaderComponent,
    ProductListComponent,
    CartComponent,
    OrderComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  cartService = inject(CartService);
  userEmail: string | null = null;

  ngOnInit() {
    this.userEmail = localStorage.getItem("userEmail");
  }
}
