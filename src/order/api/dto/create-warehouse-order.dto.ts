import { Type } from 'class-transformer';
import { IsNumber, Min, ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from 'src/shared/decorators/custome-decorators/is-non-primitive-array.decorator';
import { Supplier } from 'src/supplier/entities/supplier.entity';

export class CreateWarehouseOrderDto {
  @IsNumber()
  supplierId: Supplier;

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => MedicineOrderDto)
  medicineOrder: MedicineOrderDto[];
}

class MedicineOrderDto {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  medicineId: number;
}
