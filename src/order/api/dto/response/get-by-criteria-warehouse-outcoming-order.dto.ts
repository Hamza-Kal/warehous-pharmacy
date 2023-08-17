import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import {
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetAllOutcomingWarehouseOrder {
  id: number;
  date: Date;
  pharmacy: string;
  status: OrderStatus;
  totalPrice: number;
  constructor({ order }: { order: PharmacyOrder }) {
    this.id = order.id;
    this.date = order.created_at;
    this.pharmacy = order.pharmacy.name;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
  }

  toObject(): {
    id: number;
    date: Date;
    pharmacy: string;
    status: OrderStatus;
    totalPrice: number;
  } {
    return {
      id: this.id,
      pharmacy: this.pharmacy,
      date: this.date,
      status: this.status,
      totalPrice: this.totalPrice,
    };
  }
}
