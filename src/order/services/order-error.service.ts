import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class OrderError {
  notFoundOrderError = {
    code: errorsCode.notFoundOrder,
    message: 'Order not found',
  };

  notEnoughMedicineError = {
    code: errorsCode.notEnoughMedicine,
    message: 'Medicine is not enough for the order',
  };

  notEnoughMedicine() {
    return this.notEnoughMedicineError;
  }

  notFoundOrder() {
    return this.notFoundOrderError;
  }
}
