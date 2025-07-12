import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Patch,
  Get,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { CustomerService } from 'src/services/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private readonly customerService: CustomerService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const existingCustomer = await this.customerRepo.findOne({
      where: { email: body.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Użytkownik z tym e-mailem już istnieje.');
    }

    const hashedPassword: string = await bcrypt.hash(body.password, 10);

    const customer = this.customerRepo.create({
      email: body.email,
      password: hashedPassword,
    });

    await this.customerRepo.save(customer);
    return { message: 'Rejestracja zakończona pomyślnie.' };
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const customer = await this.customerRepo.findOne({
      where: { email: body.email },
    });

    if (!customer) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      email: customer.email,
    };
  }

  @Patch('update-email')
  updateEmail(@Body('id') id: number, @Body('email') email: string) {
    return this.customerService.updateEmail(id, email);
  }

  @Get('with-order-count')
  getCustomersWithOrderCount() {
    return this.customerService.getCustomersWithOrderCount();
  }
}
