import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCustomersWithOrderCount() {
    return this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'order')
      .loadRelationCountAndMap('customer.orderCount', 'customer.orders')
      .getMany();
  }

  async updateEmail(id: number, email: string) {
    await this.customerRepository.update(id, { email });
    return this.customerRepository.findOneBy({ id });
  }
}
