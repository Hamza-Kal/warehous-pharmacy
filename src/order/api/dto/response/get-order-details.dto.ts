import {
  DistributionPharmacyOrder,
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

//TODO wait fot the ui
export class GetPharmacyOrderDetails {
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
  medicinesDetails: {
    name: string;
    price: number;
    quantity: number;
  }[];
  constructor({ distribution }: { distribution: DistributionPharmacyOrder }) {
    this.id = distribution.order.id;
    this.orderDate = distribution.order.created_at;
    this.totalPrice = distribution.order.totalPrice;
    this.warehouse = {
      name: distribution.order.warehouse.name,
      email: distribution.order.warehouse.owner.email,
      phoneNumber: distribution.order.warehouse.phoneNumber,
      location: distribution.order.warehouse.location,
    };
    const medicines: {
      name: string;
      price: number;
      quantity: number;
    }[] = [];
    for (const detail of distribution.order.details) {
      medicines.push({
        name: detail.medicine.name,
        price: detail.price,
        quantity: detail.quantity,
      });
    }
    this.medicinesDetails = medicines;
  }

  toObject(): {
    id: number;
    warehouse: {
      name: string;
      phoneNumber: string;
      location: string;
      email: string;
    };

    // medicines: {
    //   name: string;
    //   price: number;
    //   quantity: number;
    // }[];
    totalPrice: number;
  } {
    return {
      id: this.id,
      warehouse: this.warehouse,
      //   medicines: this.medicines,
      totalPrice: this.totalPrice,
    };
  }
}
