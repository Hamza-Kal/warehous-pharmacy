import {
  PharmacyReportMedicine,
  ReportMedicineStatus,
} from 'src/report medicine/entities/report-medicine.entities';

export class GetByCriteriaPharmacyReportMedicine {
  id: number;
  name: string;
  status: ReportMedicineStatus;
  reason: string;
  quantity: number;
  constructor({ reportMedicine }: { reportMedicine: PharmacyReportMedicine }) {
    this.id = reportMedicine.id;
    this.name = reportMedicine.medicineDetails.medicine.name;
    this.reason = reportMedicine.reason;
    this.status = reportMedicine.status;
    this.quantity = reportMedicine.quantity;
  }

  toObject(): {
    id: number;
    name: string;
    reason: string;
    status: string;
    quantity: number;
  } {
    return {
      id: this.id,
      name: this.name,
      reason: this.reason,
      status: this.status,
      quantity: this.quantity,
    };
  }
}
