import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class GetByCriteraOrder {
  id: number;
  orderDate: Date;
  supplierName: string;
  status: OrderStatus;
  totalPrice: number;
  warehouse: {
    name: string;
  };
  constructor({ order }: { order: WarehouseOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.supplierName = order.supplier.name;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
    this.warehouse = {
      name: order.warehouse.name,
    };
  }

  toObject(): {
    id: number;
    orderDate: Date;
    supplierName: string;
    status: OrderStatus;
    totalPrice: number;
    warehouse: {
      name: string;
    };
  } {
    return {
      id: this.id,
      supplierName: this.supplierName,
      orderDate: this.orderDate,
      status: this.status,
      totalPrice: this.totalPrice,
      warehouse: this.warehouse,
    };
  }
}
