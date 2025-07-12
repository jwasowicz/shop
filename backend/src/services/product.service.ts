import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getOrderedProducts() {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.orders', 'order')
      .distinct(true)
      .getMany();
  }
}
