import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { IsNonPrimitiveArray } from 'src/shared/decorators/custome-decorators/is-non-primitive-array.decorator';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class CreateWarehouseOrderDto {
  @IsNumber()
  supplierId: Supplier | number;

  //TODO need to check the medicine Id are unique in the array
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineOrderDto)
  @ArrayNotEmpty()
  medicineOrder: MedicineOrderDto[];

  totalPrice: number;
}

export class CreatePharmacyOrderDto {
  @IsNumber()
  warehouseId: Warehouse | number;

  //TODO need to check the medicine Id are unique in the array
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineOrderDto)
  @ArrayNotEmpty()
  medicineOrder: MedicineOrderDto[];

  totalPrice: number;
}

class MedicineOrderDto {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  medicineId: number | Medicine;

  price: number;
}
