import { WarehouseMedicine } from 'src/medicine/entities/medicine-role.entities';

export class WarehouseGetMedicines {
  name: string;
  category: string;
  price: number;
  id: number;
  quantity: number;
  imageUrl: string | null;
  supplier: string;
  constructor({ warehouseMedicine }: { warehouseMedicine: WarehouseMedicine }) {
    this.id = warehouseMedicine.id;
    this.name = warehouseMedicine.medicine.name;
    this.category = warehouseMedicine.medicine.category.category;
    this.price = warehouseMedicine.price;
    this.quantity = warehouseMedicine.quantity;
    this.imageUrl = warehouseMedicine.medicine?.image?.url;
    this.supplier = warehouseMedicine.medicine.supplier.name;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    supplier: string;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      quantity: this.quantity,
      imageUrl: this.imageUrl,
      supplier: this.supplier,
    };
  }
}
