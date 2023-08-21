import { Pagination } from 'src/shared/pagination/pagination.validation';
import { FindAllSuppliersForWarehouseDto } from './find-all-suppliers-for-warehouse.dto';
import { IsOptional, IsString } from 'class-validator';

export class FindAllWarehousesQueryDto extends Pagination {
  @IsOptional()
  @IsString()
  name: string;
}
