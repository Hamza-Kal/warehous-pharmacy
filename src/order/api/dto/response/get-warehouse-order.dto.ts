import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class GetAllWarehouseOrder {
  id: number;
  orderDate: Date;
  supplierName: string;
  status: OrderStatus;
  totalPrice: number;
  constructor({ order }: { order: WarehouseOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.supplierName = order.supplier.name;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
  }

  toObject(): {
    id: number;
    orderDate: Date;
    supplierName: string;
    status: OrderStatus;
    totalPrice: number;
  } {
    return {
      id: this.id,
      supplierName: this.supplierName,
      orderDate: this.orderDate,
      status: this.status,
      totalPrice: this.totalPrice,
    };
  }
}
