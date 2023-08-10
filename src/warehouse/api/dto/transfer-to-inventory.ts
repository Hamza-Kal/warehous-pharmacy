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

export class TransferToInventoryDto {
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
