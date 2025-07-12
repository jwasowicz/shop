import { inject, Injectable, signal } from "@angular/core";
import { CartItem, Data, DataType } from "../models/data.model";
import { ProductService } from "./product.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CartService {
  items = signal<CartItem[]>([]);
  activeItems = signal<CartItem[]>([]);
  productService = inject(ProductService);
  showOrder = signal(false);
  private http = inject(HttpClient);

  private get userEmail(): string | null {
    return localStorage.getItem("userEmail");
  }

  private syncOrderWithBackend(items: CartItem[]) {
    const email = this.userEmail;
    if (!email) {
      console.error("Brak zalogowanego użytkownika");
      return;
    }
    this.http
      .post("http://localhost:3000/orders", {
        customerEmail: email,
        productNames: items.map((i) => i.productName),
        totalValue: items.reduce((acc, i) => acc + i.quantity * +i.price, 0),
      })
      .subscribe({
        next: () => console.log("Zamówienie zaktualizowane"),
        error: (err) => console.error("Błąd aktualizacji zamówienia", err),
      });
  }

  addItem(productName: string) {
    const product = this.productService
      .data()
      .find((item) => item.name === productName);

    if (product) {
      const newValue = {
        productName: product.name,
        quantity: 1,
        price: product.price.toString(),
        active: false,
      };

      this.items.update((oldValue) => {
        const updated = [newValue, ...oldValue];
        this.syncOrderWithBackend(updated);
        return updated;
      });
    }
  }

  changeItemQuantity(data: DataType) {
    const productIndex = this.items().findIndex(
      (item) => item.productName === data.productName
    );

    if (productIndex !== -1) {
      const product = this.items()[productIndex];
      product.quantity =
        data.actionType === "increment"
          ? product.quantity + 1
          : product.quantity - 1;

      if (product.quantity === 0) {
        this.items.update((oldValue) => {
          const updated = oldValue.filter((_, index) => index !== productIndex);
          this.syncOrderWithBackend(updated);
          return updated;
        });
      } else {
        this.items.update((oldValue) => {
          const updated = [...oldValue];
          this.syncOrderWithBackend(updated);
          return updated;
        });
      }
    }
  }

  getQuantity(productName: string) {
    const item = this.items().find((item) => item.productName === productName);
    return item ? item.quantity : 0;
  }

  removeItem(productName: string) {
    this.items.update((oldValue) => {
      const updated = oldValue.filter(
        (item) => item.productName !== productName
      );
      this.syncOrderWithBackend(updated);
      return updated;
    });
  }

  totalOrder() {
    return this.items().reduce((acc, item) => {
      return acc + item.quantity * +item.price;
    }, 0);
  }

  findElement(productName: string) {
    return this.productService.data().find((item) => item.name === productName);
  }

  clearCart() {
    this.productService.data().forEach((item) => {
      item.active = false;
    });
    this.items.set([]);
  }

  submitOrder() {
    this.http
      .patch("http://localhost:3000/orders/submit", {
        email: this.userEmail,
      })
      .subscribe({
        next: () => {
          console.log("Zamówienie zatwierdzone");
          this.clearCart();
        },
        error: (err) => console.error("Błąd zatwierdzania zamówienia", err),
      });
  }
}
