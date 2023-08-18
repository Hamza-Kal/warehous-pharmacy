import {
  InventoryReportMedicine,
  PharmacyReportMedicine,
  ReportMedicineStatus,
} from 'src/report medicine/entities/report-medicine.entities';

export class GetByCriteriaPharmacyReportMedicineWarehouse {
  id: number;
  reportDate: Date;
  status: ReportMedicineStatus;
  reason: string;
  medicine: {
    batchId: number;
    name: string;
    imageUrl: string | null;
  };
  pharmacy: {
    name: string;
    location: string;
    phoneNumber: string;
    email: string;
  };

  constructor({ reportMedicine }: { reportMedicine: PharmacyReportMedicine }) {
    this.id = reportMedicine.id;
    this.reportDate = reportMedicine.created_at;
    this.status = reportMedicine.status;
    this.medicine = {
      batchId: reportMedicine.medicineDetails.id,
      name: reportMedicine.medicineDetails.medicine.name,
      imageUrl: reportMedicine.medicineDetails.medicine.image?.url || null,
    };
    this.pharmacy = {
      phoneNumber: reportMedicine.pharmacy.phoneNumber,
      name: reportMedicine.pharmacy.name,
      location: reportMedicine.pharmacy.location,
      email: reportMedicine.pharmacy.user.email,
    };
    this.reportDate = reportMedicine.created_at;
    this.reason = reportMedicine.reason;
  }

  toObject(): {
    id: number;
    reportDate: Date;
    status: ReportMedicineStatus;
    reason: string;
    medicine: {
      batchId: number;
      name: string;
      imageUrl: string;
    };
    pharmacy: {
      name: string;
      location: string;
      phoneNumber: string;
      email: string;
    };
  } {
    return {
      id: this.id,
      status: this.status,
      reason: this.reason,
      reportDate: this.reportDate,
      medicine: this.medicine,
      pharmacy: this.pharmacy,
    };
  }
}
