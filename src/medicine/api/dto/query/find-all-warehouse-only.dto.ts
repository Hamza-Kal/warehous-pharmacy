import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllWarehouseOnly extends Pagination {
  @IsOptional()
  @IsString()
  category: string;
}
