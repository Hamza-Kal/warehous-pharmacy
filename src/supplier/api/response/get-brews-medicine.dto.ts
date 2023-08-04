import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';

export class GetBrewsMedicineDto {
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
  constructor({ brew }: { brew: SupplierMedicineDetails }) {
    this.startDate = brew.medicineDetails.startDate;
    this.endDate = brew.medicineDetails.endDate;
    this.quantity = brew.quantity;
  }

  toObject(): {
    id: number;
    startDate: Date;
    endDate: Date;
    quantity: number;
  } {
    return {
      id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      quantity: this.quantity,
    };
  }
}
