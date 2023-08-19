import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class MakePaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDate()
  @IsOptional()
  date: Date;
}
