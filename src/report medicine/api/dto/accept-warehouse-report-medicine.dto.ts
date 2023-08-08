import { IsNumber } from 'class-validator';

export class AccepReportMedicineDto {
  @IsNumber()
  reportMedicineId: number;
}
