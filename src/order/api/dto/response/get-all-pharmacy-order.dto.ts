import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import {
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetAllPharmacyOrder {
  id: number;
  orderDate: Date;
  warehouseName: string;
  status: OrderStatus;
  totalPrice: number;
  constructor({ order }: { order: PharmacyOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.warehouseName = order.warehouse.name;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
  }

  toObject(): {
    id: number;
    orderDate: Date;
    warehouseName: string;
    status: OrderStatus;
    totalPrice: number;
  } {
    return {
      id: this.id,
      warehouseName: this.warehouseName,
      orderDate: this.orderDate,
      status: this.status,
      totalPrice: this.totalPrice,
    };
  }
}
