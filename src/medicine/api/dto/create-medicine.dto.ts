import { IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { Category } from 'src/medicine/entities/medicine.entities';

export class CreateMedicine {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: Category;
}
