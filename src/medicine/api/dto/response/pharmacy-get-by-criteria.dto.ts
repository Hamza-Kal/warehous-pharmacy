import {
  InventoryMedicine,
  InventoryMedicineDetails,
  PharmacyMedicine,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class PharmacyGetByCriteriaMedicine {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;

  constructor({ medicine }: { medicine: PharmacyMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.price = medicine.price;
    this.imageUrl = medicine.medicine.image?.url || null;
  }

  toObject(): {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
  } {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      imageUrl: this.imageUrl,
    };
  }
}
