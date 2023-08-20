import { IsNumber, Max, Min } from 'class-validator';

export class RateWarehouseDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  warehouseId: number;
}
