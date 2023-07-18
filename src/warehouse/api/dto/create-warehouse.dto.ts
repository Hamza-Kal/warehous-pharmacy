import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  owner: Partial<User>;
}
