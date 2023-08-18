import {
  InventoryReportMedicine,
  ReportMedicineStatus,
} from 'src/report medicine/entities/report-medicine.entities';

export class GetByCriteriaReportMedicine {
  id: number;
  reportDate: Date;
  status: ReportMedicineStatus;
  reason: string;
  medicineDetailsId: number;
  medicineName: string;
  inventoryName: string;
  date: Date;
  constructor({ reportMedicine }: { reportMedicine: InventoryReportMedicine }) {
    this.id = reportMedicine.id;
    this.reportDate = reportMedicine.created_at;
    this.status = reportMedicine.status;
    this.medicineName = reportMedicine.medicineDetails.medicine.name;
    this.medicineDetailsId = reportMedicine.medicineDetails.id;
    this.inventoryName = reportMedicine.inventory.name;
    this.date = reportMedicine.created_at;
    this.reason = reportMedicine.reason;
  }

  toObject(): {
    id: number;
    reportDate: Date;
    reason: string;
    batchId: number;
    medicineName: string;
    inventoryName: string;
  } {
    return {
      id: this.id,
      reportDate: this.reportDate,
      batchId: this.medicineDetailsId,
      medicineName: this.medicineName,
      inventoryName: this.inventoryName,
      reason: this.reason,
    };
  }
}
