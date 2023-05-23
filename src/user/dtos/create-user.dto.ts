import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(16)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(24)
  fullName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(24)
  username: string;
}
