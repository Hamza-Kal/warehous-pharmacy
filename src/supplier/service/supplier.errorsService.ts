import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class SupplierError {
  private notFoundSupplierError = {
    code: errorsCode.notFoundSupplier,
    message: 'Supplier not found',
  };

  notFoundWarehouse() {
    return this.notFoundSupplierError;
  }
}
