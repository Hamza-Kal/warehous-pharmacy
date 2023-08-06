import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class TransferToInventoryDto {
  @IsNumber()
  inventoryId: number;

  @ValidateNested({ each: true })
  @Type(() => Batch)
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
