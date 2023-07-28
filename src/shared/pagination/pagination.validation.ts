import { IsBooleanString, IsNumberString } from 'class-validator';

export class Pagination {
  @IsNumberString()
  limit: number;

  @IsNumberString()
  page: number;

  @IsBooleanString()
  needPagination: boolean;
}
