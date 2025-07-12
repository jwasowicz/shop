import { Injectable, signal } from '@angular/core';
import { Data } from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  data = signal<Data[]>([]);

  setData(data: Data[]) {
    this.data.update((oldValue) => {
      return [...oldValue, ...data];
    });
  }
}
