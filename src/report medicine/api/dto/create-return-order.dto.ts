import { IsNumber, IsString } from 'class-validator';

export class CreateReportMedicine {
  @IsNumber()
  batchId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  reason: string;
}
