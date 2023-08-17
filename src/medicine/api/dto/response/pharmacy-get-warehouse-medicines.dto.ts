import {
  InventoryMedicine,
  InventoryMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class PharmacyGetWarehouseMedicine {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;

  constructor({ medicine }: { medicine: WarehouseMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.price = medicine.price;
    this.imageUrl = medicine.medicine.image?.url || null;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl: string | null;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      imageUrl: this.imageUrl,
    };
  }
}
