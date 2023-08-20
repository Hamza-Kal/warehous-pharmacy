import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';
@Injectable()
export class PaymentError {
  notAllowedToMakePaymentError = {
    message: 'user is not allowed to make payment error',
    error: errorsCode.notAllowedToMakePayment,
  };

  noTransactionFoundError = {
    message: 'there is no transaction between these two users',
    errorsCode: errorsCode.notTransactionFound,
  };

  notAllowedToMakePayment() {
    throw new HttpException(
      this.notAllowedToMakePaymentError,
      HttpStatus.BAD_REQUEST,
    );
  }

  notFoundTransaction() {
    throw new HttpException(this.noTransactionFoundError, HttpStatus.NOT_FOUND);
  }
}
