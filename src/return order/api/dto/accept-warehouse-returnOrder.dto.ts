import { IsNumber } from 'class-validator';

export class AccepReturnOrderDto {
  @IsNumber()
  returnOrderId: number;
}
