import { IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  password: string;
}
