import { or } from 'sequelize';
import {
  DistributionPharmacyOrder,
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetWarehouseSupplierOrderDetails {
  id: number;
  orderDate: Date;

  warehouse: {
    name: string;
    phoneNumber: string;
    location: string;
  };
  totalPrice: number;
  status: OrderStatus;
  medicines: {
    name: string;
    price: number;
    quantity: number;
  }[];
  constructor({ order }: { order: WarehouseOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.totalPrice = order.totalPrice;
    this.warehouse = {
      name: order.warehouse.name,
      phoneNumber: order.warehouse.phoneNumber,
      location: order.warehouse.location,
    };
    const medicines: {
      name: string;
      price: number;
      quantity: number;
    }[] = [];
    for (const detail of order.details) {
      medicines.push({
        name: detail.medicine.name,
        price: detail.price,
        quantity: detail.quantity,
      });
    }
    this.status = order.status;
    this.medicines = medicines;
  }

  toObject(): {
    id: number;
    warehouse: {
      name: string;
      phoneNumber: string;
      location: string;
    };
    status: OrderStatus;
    medicines: {
      name: string;
      price: number;
      quantity: number;
    }[];
    totalPrice: number;
  } {
    return {
      id: this.id,
      status: this.status,
      warehouse: this.warehouse,
      medicines: this.medicines,
      totalPrice: this.totalPrice,
    };
  }
}
