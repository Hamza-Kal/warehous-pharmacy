import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class WarehouseComplaintSupplierDto {
  @IsNumber()
  supplierId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason: string;
}

export class WarehouseComplaintPharmacyDto {
  @IsNumber()
  pharmacyId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason: string;
}
