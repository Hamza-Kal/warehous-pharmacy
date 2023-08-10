import { Type } from 'class-transformer';
import {
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';

class Batch {
  @IsNumber()
  @IsNotEmpty()
  batchId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateReportMedicineDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ValidateNested({ each: true })
  @Type(() => Batch)
  @IsNotEmpty()
  batch: Batch;
}
