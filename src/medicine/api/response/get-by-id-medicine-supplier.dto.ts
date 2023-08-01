import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetByIdMedicineSupplier {
  name: string;
  category: string;
  id: number;
  price: number;

  quantity: number;
  constructor({ medicine }: { medicine: Medicine }) {
    this.id = medicine.id;
    this.name = medicine.name;
    this.category = medicine.category.category;
    this.price = medicine.price;

    this.quantity = medicine.quantity;
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
