import { Medicine } from 'src/medicine/entities/medicine.entities';

export class WarehouseGetSupplierMedicines {
  name: string;
  category: string;
  price: number;
  id: number;
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
