import { IsDate, IsNumber, Max, Min } from 'class-validator';

export class CreateMedicineBrew {
  @IsNumber()
  medicineId: number;

  @IsDate()
  productionDate: Date;

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
