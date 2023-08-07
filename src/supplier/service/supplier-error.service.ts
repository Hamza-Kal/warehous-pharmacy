import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class SupplierError {
  notFoundSupplierError = {
    code: errorsCode.notFoundSupplier,
    message: 'ReturnOrder not found',
  };

  notFoundSupplier() {
    return this.notFoundSupplierError;
  }
}
