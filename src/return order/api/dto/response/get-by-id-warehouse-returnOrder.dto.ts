import {
  ReturnOrderStatus,
  WarehouseReturnOrder,
} from 'src/return order/entities/returnOrder.entities';

export class GetByIdWarehouseReturnOrder {
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
  returnOrderDate: Date;
  supplier: {
    name: string;
    phoneNumber: string;
    location: string;
    email: string;
  };
  status: ReturnOrderStatus;
  medicines: {
    name: string;
    price: number;
    quantity: number;
  }[];
  constructor({ returnOrder }: { returnOrder: WarehouseReturnOrder }) {
    this.id = returnOrder.id;
    this.returnOrderDate = returnOrder.created_at;
    this.supplier = {
      name: returnOrder.supplier.name,
      email: returnOrder.supplier.user.email,
      phoneNumber: returnOrder.supplier.phoneNumber,
      location: returnOrder.supplier.location,
    };
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
    }[];
  } {
    return {
      id: this.id,
      supplier: this.supplier,
      medicines: this.medicines,
    };
  }
}
