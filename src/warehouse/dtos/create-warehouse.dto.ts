import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
