import { IsEnum, IsOptional } from 'class-validator';
import { ReturnOrderStatus } from 'src/return order/entities/returnOrder.entities';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllOrdersQueryDto extends Pagination {
  @IsEnum(ReturnOrderStatus)
  @IsOptional()
  status: ReturnOrderStatus;
}
