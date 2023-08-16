import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  MinLength,
  NotEquals,
  ValidateIf,
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
export class TransferFromInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.to !== o.from)
  to: number;

  @ValidateNested({ each: true })
  @Type(() => Batch)
  @IsArray()
  @IsNotEmpty()
  batches: Batch[];
}
