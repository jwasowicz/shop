import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../services/product.service';
import data from '../../../api/data.json';
import { ProductCardComponent } from './product-card/product-card.component';
import { Data, ImageI } from '../models/data.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [ProductCardComponent],
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  products = signal<Data[]>([]);

  ngOnInit(): void {
    this.productService.setData(data);
    this.products.set(this.productService.data());
  }
}
