import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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
}
