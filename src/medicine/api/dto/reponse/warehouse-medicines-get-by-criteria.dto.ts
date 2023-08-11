import { WarehouseMedicine } from 'src/medicine/entities/medicine-role.entities';

export class WarehouseMedicines {
  id: number;
  name: string;
  batches: {
    id: number;
    expireDate: Date;
    quantity: number;
  }[];
  medicineSupplier: string;
  medicineCategory: string;
  constructor({ medicine }: { medicine: WarehouseMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    const batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[] = [];
    for (const { id, medicineDetails, quantity } of medicine.medicineDetails) {
      batches.push({
        id,
        quantity,
        expireDate: medicineDetails.endDate,
      });
    }
    this.batches = batches;
    this.medicineCategory = medicine.medicine.category.category;
    this.medicineSupplier = medicine.medicine.supplier.name;
  }

  toObject(): {
    id: number;
    name: string;
    batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[];
    medicineCategory: string;
    medicineSupplier: string;
  } {
    return {
      id: this.id,
      name: this.name,
      batches: this.batches,
      medicineCategory: this.medicineCategory,
      medicineSupplier: this.medicineSupplier,
    };
  }
}
