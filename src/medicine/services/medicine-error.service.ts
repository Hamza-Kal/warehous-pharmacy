import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class MedicineError {
  notFoundMedicineError = {
    code: errorsCode.notFoundMedicine,
    message: 'Medicine not found',
  };
  notFoundCategoryError = {
    code: errorsCode.notFoundCategory,
    message: 'Category not found',
  };

  notFoundMedicine() {
    return this.notFoundMedicineError;
  }

  notFoundCategory() {
    return this.notFoundCategoryError;
  }
}
