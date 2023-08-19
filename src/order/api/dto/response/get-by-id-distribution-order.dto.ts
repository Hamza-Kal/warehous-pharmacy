import {
  DistributionPharmacyOrder,
  OrderStatus,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

//! maybe adding medicineDetails name
export class GetByIdOrderDistribution {
  id: number;
  name: string;
  location: string;
  medicine: {
    expireDate: Date;
    quantity: number;
    name: string;
    imageUrl: string | null;
  }[];
  constructor({ distribution }: { distribution: any }) {
    this.id = distribution.id;
    this.name = distribution.name;
    this.location = distribution.location;
    const medicines = [];
    for (const medicine of distribution.medicine) {
      medicines.push({
        expireDate: medicine.expireDate,
        quantity: medicine.quantity,
        name: medicine.name,
        imageUrl: medicine.imageUrl,
      });
    }
    this.medicine = medicines;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    medicines: {
      name: string;
      quantity: number;
      imageUrl: string | null;
      expireDate: Date;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      medicines: this.medicine,
    };
  }
}
