import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductService } from 'src/services/product.service';
import { Repository } from 'typeorm';

@Controller('products')
export class ProductController {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private readonly productService: ProductService,
  ) {}

  @Get('ordered')
  getOrderedProducts() {
    return this.productService.getOrderedProducts();
  }
}
