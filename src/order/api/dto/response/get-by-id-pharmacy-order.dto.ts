import {
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetByIdPharmacyOrder {
  id: number;
  orderDate: Date;
  warehouse: {
    name: string;
    phoneNumber: string;
    location: string;
    email: string;
  };
  totalPrice: number;
  status: OrderStatus;
  medicines: {
    name: string;
    price: number;
    quantity: number;
  }[];
  constructor({ order }: { order: PharmacyOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.totalPrice = order.totalPrice;
    this.warehouse = {
      name: order.warehouse.name,
      email: order.warehouse.owner.email,
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
    this.medicines = medicines;
  }

  toObject(): {
    id: number;
    warehouse: {
      name: string;
      phoneNumber: string;
      location: string;
      email: string;
    };

    medicines: {
      name: string;
      price: number;
      quantity: number;
    }[];
    totalPrice: number;
  } {
    return {
      id: this.id,
      warehouse: this.warehouse,
      medicines: this.medicines,
      totalPrice: this.totalPrice,
    };
  }
}
