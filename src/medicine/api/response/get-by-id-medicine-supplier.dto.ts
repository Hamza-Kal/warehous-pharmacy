import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetByIdMedicineSupplier {
  name: string;
  category: string;
  id: number;
  price: number;
  constructor({ medicine }: { medicine: Medicine }) {
    this.id = medicine.id;
    this.name = medicine.name;
    this.category = medicine.category.category;
    this.price = medicine.price;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
    };
  }
}
