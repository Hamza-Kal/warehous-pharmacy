import {
  InventoryReportMedicine,
  ReportMedicineStatus,
} from 'src/report medicine/entities/report-medicine.entities';

export class GetByCriteraReportMedicine {
  id: number;
  reportMedicineDate: Date;
  supplierName: string;
  status: ReportMedicineStatus;
  constructor({ reportMedicine }: { reportMedicine: InventoryReportMedicine }) {
    this.id = reportMedicine.id;
    this.reportMedicineDate = reportMedicine.created_at;
    this.status = reportMedicine.status;
  }

  toObject(): {
    id: number;
    reportMedicineDate: Date;
    status: ReportMedicineStatus;
  } {
    return {
      id: this.id,
      reportMedicineDate: this.reportMedicineDate,
      status: this.status,
    };
  }
}
