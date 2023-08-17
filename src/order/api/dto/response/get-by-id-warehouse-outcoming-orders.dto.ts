import {
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetByIdWarehouseOutcomingOrder {
  //     "details": [
  //         {
  //             "quantity": 99,
  //             "price": 247500,
  //             "medicine": {
  //                 "name": "vitamen c"
  //             }
  //         }
  //     ]
  id: number;
  orderDate: Date;
  pharmacy: {
    name: string;
    phoneNumber: string;
    location: string;
    email: string;
  };
  status: OrderStatus;
  medicines: {
    name: string;
    price: number;
    quantity: number;
  }[];
  constructor({ order }: { order: PharmacyOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.pharmacy = {
      name: order.pharmacy.name,
      email: order.pharmacy.user.email,
      phoneNumber: order.pharmacy.phoneNumber,
      location: order.pharmacy.location,
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
    pharmacy: {
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
  } {
    return {
      id: this.id,
      pharmacy: this.pharmacy,
      medicines: this.medicines,
    };
  }
}
