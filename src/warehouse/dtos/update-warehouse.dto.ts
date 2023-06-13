import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber, IsOptional } from "class-validator";

export class UpdateWareHouseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;
}
