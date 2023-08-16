import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';

export class GetMedicineBathesDto {
  name: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  constructor({ batch }: { batch: SupplierMedicineDetails }) {
    this.name = 'batchName';
    this.quantity = batch.quantity;
    this.startDate = batch.medicineDetails.startDate;
    this.endDate = batch.medicineDetails.endDate;
  }

  toObject(): {
    name: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
  } {
    return {
      name: this.name,
      quantity: this.quantity,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}
