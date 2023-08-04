import { SupplierMedicine } from 'src/medicine/entities/medicine-role.entities';

export class GetByIdMedicineSupplier {
  name: string;
  category: string;
  id: number;
  price: number;

  quantity: number;
  constructor({ supplierMedicine }: { supplierMedicine: SupplierMedicine }) {
    this.id = supplierMedicine.id;
    this.name = supplierMedicine.medicine.name;
    this.category = supplierMedicine.medicine.category.category;
    this.price = supplierMedicine.price;

    this.quantity = supplierMedicine.quantity;
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
