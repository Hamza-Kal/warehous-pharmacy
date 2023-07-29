import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  IsEmail,
  IsNumberString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/roles';
import { Api } from 'src/shared/enums/API';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @MaxLength(24)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  fullName: string;

  assignedRole: Role;
}

export class InventroyRegister {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @MaxLength(24)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  fullName: string;

  @IsString()
  @MaxLength(16)
  name: string;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsNumberString()
  inventoryPhoneNumber: string;

  assignedRole: Role;
  completedAccount: boolean;
}
