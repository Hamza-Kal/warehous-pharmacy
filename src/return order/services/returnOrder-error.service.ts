import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class ReturnOrderError {
  notFoundReturnOrderError = {
    code: errorsCode.notFoundReturnOrder,
    message: 'ReturnOrder not found',
  };

  notFoundReturnOrder() {
    return this.notFoundReturnOrderError;
  }
}
