import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllSuppliersForWarehouseDto {
  @IsOptional()
  @IsString()
  name: string;
}
