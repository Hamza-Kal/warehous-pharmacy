import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/order/entities/order.entities';
import { ReturnOrderStatus } from 'src/return order/entities/returnOrder.entities';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllOrdersQueryDto extends Pagination {
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
