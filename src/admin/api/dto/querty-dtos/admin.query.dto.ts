import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export class AdminQueryDto extends Pagination {
  @IsOptional()
  @IsString()
  name: string;
}
