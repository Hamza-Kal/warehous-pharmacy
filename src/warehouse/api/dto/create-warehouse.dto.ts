import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  location: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  owner: User;
}
