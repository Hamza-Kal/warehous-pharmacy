import {
  IsBoolean,
  IsBooleanString,
  IsNumberString,
  Max,
  Min,
} from 'class-validator';

export class Pagination {
  @IsNumberString()
  @Min(0)
  @Max(20)
  limit: number;

  @IsNumberString()
  @Min(0)
  page: number;

  @IsBooleanString()
  needPagination: boolean;
}
