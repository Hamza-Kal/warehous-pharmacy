import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class GetByIdWarehouseOrder {
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
  supplier: {
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
    imageUrl: string | null;
  }[];
  constructor({ order }: { order: WarehouseOrder }) {
    this.id = order.id;
    this.orderDate = order.created_at;
    this.supplier = {
      name: order.supplier.name,
      email: order.supplier.user.email,
      phoneNumber: order.supplier.phoneNumber,
      location: order.supplier.location,
    };
    const medicines: {
      name: string;
      price: number;
      quantity: number;
      imageUrl: string | null;
    }[] = [];
    for (const detail of order.details) {
      medicines.push({
        name: detail.medicine.name,
        price: detail.price,
        quantity: detail.quantity,
        imageUrl: detail.medicine?.image?.url || null,
      });
    }
    this.medicines = medicines;
  }

  toObject(): {
    id: number;
    supplier: {
      name: string;
      phoneNumber: string;
      location: string;
      email: string;
    };
    medicines: {
      name: string;
      price: number;
      quantity: number;
      imageUrl: string | null;
    }[];
  } {
    return {
      id: this.id,
      supplier: this.supplier,
      medicines: this.medicines,
    };
  }
}
