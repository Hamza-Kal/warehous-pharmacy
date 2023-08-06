import { Type } from 'class-transformer';
import { IsNumber, Min, ValidateNested } from 'class-validator';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { IsNonPrimitiveArray } from 'src/shared/decorators/custome-decorators/is-non-primitive-array.decorator';
import { Supplier } from 'src/supplier/entities/supplier.entity';

export class CreateWarehouseReturnOrderDto {
  @IsNumber()
  supplierId: Supplier | number;

  //TODO need to check the medicine Id are unique in the array
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => MedicineReturnOrderDto)
  medicineReturnOrder: MedicineReturnOrderDto[];

  totalPrice: number;
}

class MedicineReturnOrderDto {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  medicineId: number | Medicine;

  price: number;
}
