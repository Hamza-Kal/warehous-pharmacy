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
  notFoundInventory() {
    return this.notFoundInventoryError;
  }
  notFoundMedicine() {
    return this.notFoundMedicineError;
  }

  notFoundCategory() {
    return this.notFoundCategoryError;
  }

  notEnoughMedicine() {
    return this.notEnoughMedicineError;
  }
}
