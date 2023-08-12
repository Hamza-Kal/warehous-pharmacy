import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';
import { WarehouseMedicine } from 'src/medicine/entities/medicine-role.entities';
import {
  Category,
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class CreateMedicine {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: Category | number;

  @IsNumber()
  imageId: Media | number | null;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  price: number;
}
export class CreateWarehouseMedicine {
  medicine: Medicine | number;

  warehouse: Warehouse | number;
}

export class CreateWarehouseMedicineDetails {
  medicine: WarehouseMedicine | number;

  medicineDetails: MedicineDetails | number;
}
