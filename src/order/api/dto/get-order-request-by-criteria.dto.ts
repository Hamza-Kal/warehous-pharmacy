import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/order/entities/order.entities';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class GetOrder extends Pagination {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
