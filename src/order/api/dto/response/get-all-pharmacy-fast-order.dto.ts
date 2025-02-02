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

export class GetAllFastWarehouseOrder {
  id: number;
  date: Date;
  pharmacy: {
    name: string;
    location: string;
    phoneNumber: string;
  };
  status: OrderStatus;

  constructor({ order }: { order: PharmacyFastOrder }) {
    this.id = order.id;
    this.date = order.created_at;
    this.pharmacy = {
      name: order.pharmacy.name,
      location: order.pharmacy.location,
      phoneNumber: order.pharmacy.phoneNumber,
    };
    this.status = order.status;
  }

  toObject(): {
    id: number;
    date: Date;
    pharmacy: {
      name: string;
      location: string;
      phoneNumber: string;
    };
    status: OrderStatus;
  } {
    return {
      id: this.id,
      pharmacy: this.pharmacy,
      date: this.date,
      status: this.status,
    };
  }
}
