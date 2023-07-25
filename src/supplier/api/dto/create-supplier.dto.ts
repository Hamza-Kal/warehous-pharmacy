import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';
export class CreateSupplierDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  location: string;

  @IsNumberString()
  phoneNumber: string;

  user: User;
}
