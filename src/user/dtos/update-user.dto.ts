import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/shared/enums/roles';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(16)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  fullName: string;

  @IsEnum(Role)
  role: Role;
}
