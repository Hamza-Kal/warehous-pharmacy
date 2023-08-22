import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class ComplaintError {
  private notFoundSupplierError = {
    code: errorsCode.notFoundSupplier,
    message: 'Supplier not found',
  };

  private notFoundWarehouseError = {
    code: errorsCode.notFoundWarehouse,
    message: 'Warehouse not found',
  };

  private notFoundPharmacyError = {
    code: errorsCode.notFoundPharmacy,
    message: 'Pharmacy not found',
  };

  private notFoundComplaintError = {
    code: errorsCode.notFoundComplaint,
  };

  notFoundComplaint() {
    return this.notFoundComplaintError;
  }

  notFoundSupplier() {
    return this.notFoundSupplierError;
  }

  notFoundWarehouse() {
    return this.notFoundWarehouseError;
  }

  notFoundPharmacy() {
    return this.notFoundPharmacyError;
  }
}
