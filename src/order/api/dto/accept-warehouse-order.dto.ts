import { IsNumber } from 'class-validator';

export class AccepOrderDto {
  @IsNumber()
  orderId: number;
}
