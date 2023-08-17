import {
  InventoryMedicine,
  InventoryMedicineDetails,
  PharmacyMedicine,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class PharmacyGetByIdMedicine {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;

  constructor({ medicine }: { medicine: PharmacyMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.price = medicine.price;
    this.imageUrl = medicine.medicine.image?.url || null;
    this.category = medicine.medicine.category.category;
  }

  toObject(): {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl: string | null;
  } {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      imageUrl: this.imageUrl,
    };
  }
}
