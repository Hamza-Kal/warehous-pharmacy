import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class MedicineError {
  private notFoundMedicineError = {
    code: errorsCode.notFoundMedicine,
    message: 'Medicine not found',
  };
  private notFoundCategoryError = {
    code: errorsCode.notFoundCategory,
    message: 'Category not found',
  };

  private notEnoughMedicineError = {
    code: errorsCode.notEnoughMedicine,
    message: 'Not enough medicine',
  };

  private notFoundInventoryError = {
    code: errorsCode.notFoundInventory,
    message: 'Inventory not found',
  };
  private notFoundSupplierError = {
    code: errorsCode.notFoundSupplier,
    message: 'supplier not found',
  };
  private notFoundWarehouseError = {
    code: errorsCode.notFoundSupplier,
    message: 'warehouse not found',
  };
  private notFoundPharmacyError = {
    code: errorsCode.notFoundPharmacy,
    message: 'pharmacy not found',
  };
  private notFoundImageError = {
    code: errorsCode.notFoundImage,
    message: 'Image not found',
  };

  notFoundSupplier() {
    return this.notFoundSupplierError;
  }

  notFoundWarehouse() {
    return this.notFoundWarehouseError;
  }

  notFoundInventory() {
    return this.notFoundInventoryError;
  }

  notFoundPharmacy() {
    return this.notFoundPharmacyError;
  }

  notFoundMedicine() {
    return this.notFoundMedicineError;
  }

  notFoundCategory() {
    return this.notFoundCategoryError;
  }
  notFoundImage() {
    return this.notFoundImageError;
  }

  notEnoughMedicine() {
    return this.notEnoughMedicineError;
  }
}
