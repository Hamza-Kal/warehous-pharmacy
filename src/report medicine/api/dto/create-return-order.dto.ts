import { IsNumber } from 'class-validator';

export class CreateReportMedicine {
  @IsNumber()
  batchId: number;

  @IsNumber()
  quantity: number;
}
