import {
  DistributionPharmacyOrder,
  OrderStatus,
  WarehouseOrder,
} from 'src/order/entities/order.entities';

//! maybe adding medicineDetails name
export class GetByIdOrderDistribution {
  id: number;
  quantity: number;
  imageUrl: string | null;
  inventoryName: string;
  medicineName: string;
  medicineDetails: number;
  constructor({ distribution }: { distribution: DistributionPharmacyOrder }) {
    this.id = distribution.id;
    this.quantity = distribution.quantity;
    this.imageUrl = distribution.medicineDetails.medicine.image?.url || null;
    this.inventoryName = distribution.inventory.name;
    this.medicineName = distribution.medicineDetails.medicine.name;
    this.medicineDetails = distribution.medicineDetails.id;
  }

  toObject(): {
    id: number;
    inventory: string;
    medicine: string;
    batchId: number;
    quantity: number;
    imageUrl: string;
  } {
    return {
      id: this.id,
      inventory: this.inventoryName,
      medicine: this.medicineName,
      batchId: this.medicineDetails,
      quantity: this.quantity,
      imageUrl: this.imageUrl,
    };
  }
}
