import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/shared/enums/roles';
import { Pagination } from 'src/shared/pagination/pagination.validation';

export enum PaymentRole {
  PHARMACY = 'pharmacy',
  WAREHOUSE = 'warehouse',
  SUPPLIER = 'supplier',
}
export class FindAll extends Pagination {
  @IsEnum(PaymentRole)
  role: PaymentRole;
}
