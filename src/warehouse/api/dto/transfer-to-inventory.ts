import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class TransferToInventoryDto {
  @IsNumber()
  inventoryId: number;

  @ValidateNested({ each: true })
  @Type(() => Batch)
  batches: Batch[];
}

class Batch {
  @IsNumber()
  batchId: number;

  @IsNumber()
  quantity: number;
}
