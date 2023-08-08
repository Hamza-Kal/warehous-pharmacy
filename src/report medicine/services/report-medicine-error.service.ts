import { Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class ReportMedicineError {
  notFoundReportMedicineError = {
    code: errorsCode.notFoundReportMedicine,
    message: 'ReportMedicine not found',
  };

  notFoundReportMedicine() {
    return this.notFoundReportMedicineError;
  }
}
