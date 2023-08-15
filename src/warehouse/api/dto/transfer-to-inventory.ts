import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class Batch {
  @IsNumber()
  @IsNotEmpty()
  batchId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
export class TransferToInventoryDto {
  @ValidateNested({ each: true })
  @Type(() => Batch)
  @IsNotEmpty()
  batch: Batch;
}
