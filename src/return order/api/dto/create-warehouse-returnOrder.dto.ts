import { Type } from 'class-transformer';
import {
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreateWarehouseReturnOrderDto {
  @ValidateNested({ each: true })
  @Type(() => Batch)
  @IsArray()
  @ArrayNotEmpty()
  batches: Batch[];
}

class Batch {
  @IsNumber()
  @IsNotEmpty()
  batchId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
