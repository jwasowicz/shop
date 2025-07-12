import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { CustomerController } from './controllers/customer.controller';
import { OrderController } from './controllers/order.controller';
import { ProductController } from './controllers/products.controller';
import { CustomerService } from './services/customer.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Product, Order]),
  ],

  controllers: [
    AppController,
    CustomerController,
    OrderController,
    ProductController,
  ],
  providers: [AppService, CustomerService, OrderService, ProductService],
})
export class AppModule {}
