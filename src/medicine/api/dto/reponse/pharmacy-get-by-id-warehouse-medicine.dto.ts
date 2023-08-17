import {
  InventoryMedicine,
  InventoryMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class PharmacyGetByIdWarehouseMedicine {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  description: string;

  constructor({ medicine }: { medicine: WarehouseMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.price = medicine.price;
    this.description = medicine.medicine.description;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl: string | null;
    description: string;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      description: this.description,
      imageUrl: this.imageUrl,
    };
  }
}
