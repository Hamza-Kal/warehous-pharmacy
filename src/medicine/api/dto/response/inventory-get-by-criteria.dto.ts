import { InventoryMedicine } from 'src/medicine/entities/medicine-role.entities';

export class GetByCriteriaInventoryMedicines {
  id: number;
  name: string;
  category: string;
  quantity: number;
  imageUrl: string | null;
  constructor({ medicine }: { medicine: InventoryMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.quantity = medicine.quantity;
    this.imageUrl = medicine.medicine?.image?.url;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    quantity: number;
    imageUrl: string | null;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      imageUrl: this.imageUrl,
    };
  }
}
