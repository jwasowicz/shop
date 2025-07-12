import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { Customer } from 'src/entities/customer.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getOrdersAboveValue(minValue: number) {
    return this.orderRepository.find({
      where: { totalValue: MoreThan(minValue) },
      relations: ['customer', 'products'],
    });
  }

  async deleteOrder(id: number) {
    await this.orderRepository.delete(id);
    return { success: true };
  }

  async createOrder(dto: CreateOrderDto) {
    const customer = await this.customerRepo.findOneBy({
      email: dto.customerEmail,
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const products = await this.productRepo.find({
      where: dto.productNames.map((name) => ({ name })),
    });

    const order = this.orderRepository.create({
      customer,
      products,
      totalValue: dto.totalValue,
    });

    return this.orderRepository.save(order);
  }

  async createOrUpdateOrder(dto: CreateOrderDto) {
    const customer = await this.customerRepo.findOne({
      where: { email: dto.customerEmail },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const latestOrder = await this.orderRepository.findOne({
      where: { customer: { id: customer.id } },
      order: { date: 'DESC' },
    });

    const shouldCreateNewOrder =
      !latestOrder || latestOrder.status === 'submitted';

    const products = await this.productRepo.findBy(
      dto.productNames.map((name) => ({ name })),
    );

    if (shouldCreateNewOrder) {
      const newOrder = this.orderRepository.create({
        customer,
        products,
        totalValue: dto.totalValue,
        status: 'open',
      });
      return this.orderRepository.save(newOrder);
    } else {
      latestOrder.products = products;
      latestOrder.totalValue = dto.totalValue;
      return this.orderRepository.save(latestOrder);
    }
  }

  async submitOrder(email: string) {
    const customer = await this.customerRepo.findOneBy({ email });
    if (!customer) throw new NotFoundException('Customer not found');

    const order = await this.orderRepository.findOne({
      where: {
        customer: { id: customer.id },
        status: 'open',
      },
      relations: ['products'],
    });

    if (!order) throw new NotFoundException('No open order to submit');

    const productCountMap = new Map<number, number>();
    for (const product of order.products) {
      productCountMap.set(
        product.id,
        (productCountMap.get(product.id) || 0) + 1,
      );
    }

    for (const [productId, count] of productCountMap.entries()) {
      const product = await this.productRepo.findOneBy({ id: productId });
      if (product) {
        product.stock = Math.max(0, product.stock - count);
        await this.productRepo.save(product);
      }
    }

    order.status = 'submitted';
    return this.orderRepository.save(order);
  }
}
