import { IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
export class CreatePharmacyDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  location: string;

  @IsPhoneNumber()
  phoneNumber: string;

  owner: User;
}
