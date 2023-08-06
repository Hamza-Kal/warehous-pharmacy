import { IsBooleanString, IsNumberString } from 'class-validator';

export class Pagination {
  @IsNumberString()
  limit: number;

  @IsNumberString()
  page: number;

  skip: number;

  criteria: any;

  // @IsBooleanString()
  // needPagination: boolean;
}
