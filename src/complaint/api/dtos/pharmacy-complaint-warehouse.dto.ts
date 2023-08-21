import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class PharmacyComplainWarehousetDto {
  @IsNumber()
  warehouseId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason: string;
}
