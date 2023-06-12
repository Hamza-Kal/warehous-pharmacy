import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsPhoneNumber, IsOptional } from "class-validator";

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;
}
