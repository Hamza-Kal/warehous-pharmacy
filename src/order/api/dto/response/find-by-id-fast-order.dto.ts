import { or } from 'sequelize';
import {
  OrderStatus,
  PharmacyFastOrder,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

export class GetByIdFastWarehouseOutcomingOrder {
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

  status: OrderStatus;
  medicines: {
    name: string;

    quantity: number;
    imageUrl: string | null;
  }[];
  constructor({ order }: { order: PharmacyFastOrder }) {
    this.id = order.id;

    const medicines: {
      name: string;

      quantity: number;
      imageUrl: string | null;
    }[] = [];
    for (const detail of order.details) {
      medicines.push({
        name: detail.medicine.name,

        quantity: detail.quantity,
        imageUrl: detail.medicine?.image?.url || null,
      });
    }
    this.medicines = medicines;
  }

  toObject(): {
    id: number;

    medicines: {
      name: string;

      quantity: number;
      imageUrl: string | null;
    }[];
  } {
    return {
      id: this.id,
      medicines: this.medicines,
    };
  }
}
