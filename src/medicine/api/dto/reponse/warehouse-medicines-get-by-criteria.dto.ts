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
  imageUrl: string | null;
  constructor({ medicine }: { medicine: WarehouseMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.imageUrl = medicine.medicine?.image?.url;
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
    imageUrl: string | null;
    medicineCategory: string;
    medicineSupplier: string;
    batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      medicineCategory: this.medicineCategory,
      medicineSupplier: this.medicineSupplier,
      imageUrl: this.imageUrl,
      batches: this.batches,
    };
  }
}
