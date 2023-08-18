import {
  InventoryMedicine,
  InventoryMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class InventoryMedicinesDto {
  id: number;
  name: string;
  imageUrl: string | null;
  batches: {
    id: number;
    quantity: number;
    expireDate: Date;
  }[];

  constructor({ medicine }: { medicine: InventoryMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.imageUrl = medicine.medicine.image?.url || null;
    const batches: {
      id: number;
      quantity: number;
      expireDate: Date;
    }[] = [];
    for (const batch of medicine.medicineDetails) {
      batches.push({
        id: batch.id,
        quantity: batch.quantity,
        expireDate: batch.medicineDetails.endDate,
      });
    }
    this.batches = batches;
  }

  toObject(): {
    id: number;
    name: string;
    imageUrl: string;
    batches: {
      id: number;
      quantity: number;
      expireDate: Date;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      batches: this.batches,
    };
  }
}
