import { th } from '@faker-js/faker';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';

export class GetBrewsMedicineDto {
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
  constructor({ brew }: { brew: MedicineDetails }) {
    this.startDate = brew.startDate;
    this.endDate = brew.endDate;
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
