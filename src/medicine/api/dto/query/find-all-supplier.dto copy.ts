import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class FindAllSuppliers extends Pagination {
  @IsOptional()
  @IsString()
  category: string;
}
