import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(16)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(16)
  fullName: string;
}
