import {
  SupplierMedicine,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';

export class WarehouseGetMedicines {
  name: string;
  category: string;
  price: number;
  id: number;
  quantity: number;
  constructor({ warehouseMedicine }: { warehouseMedicine: WarehouseMedicine }) {
    this.id = warehouseMedicine.id;
    this.name = warehouseMedicine.medicine.name;
    this.category = warehouseMedicine.medicine.category.category;
    this.price = warehouseMedicine.price;
    this.quantity = warehouseMedicine.quantity;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      quantity: this.quantity,
    };
  }
}
