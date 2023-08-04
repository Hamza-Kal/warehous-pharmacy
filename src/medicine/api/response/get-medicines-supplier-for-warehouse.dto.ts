import { SupplierMedicine } from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';

export class WarehouseGetSupplierMedicines {
  name: string;
  category: string;
  price: number;
  id: number;
  constructor({ supplierMedicine }: { supplierMedicine: SupplierMedicine }) {
    this.id = supplierMedicine.id;
    this.name = supplierMedicine.medicine.name;
    this.category = supplierMedicine.medicine.category.category;
    this.price = supplierMedicine.price;
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
