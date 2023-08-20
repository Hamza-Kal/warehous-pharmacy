import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class WarehouseError {
  private notFoundWarehouseError = {
    code: errorsCode.notFoundWarehouse,
    message: 'Warehouse not found',
  };

  notFoundWarehouse() {
    return this.notFoundWarehouseError;
  }
}
