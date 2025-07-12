import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from 'src/dto/create-order.dto';

import { OrderService } from 'src/services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('above/:value')
  getOrdersAboveValue(@Param('value') value: number) {
    return this.orderService.getOrdersAboveValue(Number(value));
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Post()
  createOrUpdateOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrUpdateOrder(body);
  }

  @Patch('submit')
  submitCurrentOrder(@Body('email') email: string) {
    return this.orderService.submitOrder(email);
  }
}
