import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Media } from 'src/media/entities/media.entity';
import { Category } from 'src/medicine/entities/medicine.entities';

export class UpdateMedicineDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  categoryId: Category | number;

  @IsOptional()
  @IsNumber()
  imageId: Media | number | null;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  @IsOptional()
  price: number;
}

export class UpdateBatch {
  @IsNumber()
  @Min(0)
  quantity: number;
}
