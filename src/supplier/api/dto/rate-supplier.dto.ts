import { IsNumber, Max, Min } from 'class-validator';
import { RateWarehouseDto } from 'src/warehouse/api/dto/rate-warehouse.dto';

export class RateSupplierDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  supplierId: number;
}
