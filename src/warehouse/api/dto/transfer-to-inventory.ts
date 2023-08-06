import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class TransferToInventoryDto {
  @IsNumber()
  inventoryId: number;

  @ValidateNested({ each: true })
  @Type(() => Batch)
  @IsArray()
  @ArrayNotEmpty()
  batches: Batch[];
}

class Batch {
  @IsNumber()
  batchId: number;

  @IsNumber()
  quantity: number;
}
