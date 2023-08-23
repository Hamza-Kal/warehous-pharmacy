import { th } from '@faker-js/faker';
import { or } from 'sequelize';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import {
  OrderStatus,
  PharmacyFastOrder,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetAllFastPharmacyOrder {
  id: number;
  date: Date;
  medicines: {
    name: string;
    quantity: number;
  }[];

  constructor({ order }: { order: PharmacyFastOrder }) {
    this.id = order.id;
    this.date = order.created_at;
    const medicines: {
      name: string;
      quantity: number;
    }[] = [];

    for (const medicine of order.details) {
      medicines.push({
        name: medicine.medicine.name,
        quantity: medicine.quantity,
      });
    }

    this.medicines = medicines;
  }

  toObject(): {
    id: number;
    date: Date;
    medicines: {
      name: string;
      quantity: number;
    }[];
  } {
    return {
      id: this.id,
      medicines: this.medicines,
      date: this.date,
    };
  }
}
