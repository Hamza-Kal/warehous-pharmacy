import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllWarehouseQueryDto extends Pagination {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category: string;
}
