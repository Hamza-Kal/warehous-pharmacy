import { th } from '@faker-js/faker';
import {
  InventoryMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class GetByIdInventoryMedicines {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batch: {
    expireDate: Date;
    quantity: number;
    id: number;
  }[];
  constructor({ medicine }: { medicine: InventoryMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.quantity = medicine.quantity;
    this.price = medicine.medicine.warehouseMedicine.price;
    const batch: {
      expireDate: Date;
      quantity: number;
      id: number;
    }[] = [];

    for (const medicineDetail of medicine.medicineDetails) {
      batch.push({
        expireDate: medicineDetail.medicineDetails.endDate,
        id: medicineDetail.id,
        quantity: medicineDetail.quantity,
      });
    }
    this.batch = batch;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    quantity: number;
    price: number;
    batch: {
      expireDate: Date;
      quantity: number;
      id: number;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      batch: this.batch,
    };
  }
}
