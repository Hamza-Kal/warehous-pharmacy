import { Type } from 'class-transformer';
import {
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateReportMedicineDto {
  @IsString()
  @IsNotEmpty()
  returnReason: string;

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
