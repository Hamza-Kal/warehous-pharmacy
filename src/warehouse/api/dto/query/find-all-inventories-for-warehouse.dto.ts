import { IsOptional, IsString } from 'class-validator';

export class FindAllInventoriesForWarehouseDto {
  @IsOptional()
  @IsString()
  name: string;
}
