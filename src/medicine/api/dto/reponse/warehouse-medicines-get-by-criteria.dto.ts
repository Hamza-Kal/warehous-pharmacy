import { th } from '@faker-js/faker';
import {
  SupplierMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class WarehouseMedicines {
  id: number;
  name: string;
  batches: {
    id: number;
    expireDate: Date;
    quantity: number;
  }[];
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
  }

  toObject(): {
    id: number;
    name: string;
    batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      batches: this.batches,
    };
  }
}
