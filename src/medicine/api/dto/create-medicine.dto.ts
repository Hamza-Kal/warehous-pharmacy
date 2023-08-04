import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Category, Medicine } from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class CreateMedicine {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: Category;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  price: number;
}
export class CreateWarehouseMedicine {
  medicine: Medicine | number;

  quantity: number;

  price: number;

  warehouse: Warehouse | number;
}
