import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateInventoryDto {
  @IsString()
  @MaxLength(16)
  name: string;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  manager: Partial<User>;
}
