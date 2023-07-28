import { Type } from 'class-transformer';
import { IsDate, IsNumber, Max, Min } from 'class-validator';

export class CreateMedicineBrew {
  @IsNumber()
  medicineId: number;

  @Type(() => Date)
  @IsDate()
  productionDate: Date;

  @Type(() => Date)
  @IsDate()
  expireDate: Date;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  quantity: number;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  price: number;
}
