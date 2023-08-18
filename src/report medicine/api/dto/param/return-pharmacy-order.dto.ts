import { IsNumberString } from 'class-validator';
import { IParams } from 'src/shared/interface/params.interface';

export class ReturnPharmacyOrder extends IParams {
  @IsNumberString()
  orderId: number;
}
