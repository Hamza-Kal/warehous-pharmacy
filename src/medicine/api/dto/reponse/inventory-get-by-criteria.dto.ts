import { th } from '@faker-js/faker';
import {
  InventoryMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

export class GetByCriteriaInventoryMedicines {
  id: number;
  name: string;
  category: string;
  quantity: number;
  constructor({ medicine }: { medicine: InventoryMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.quantity = medicine.quantity;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    quantity: number;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
    };
  }
}
