import { Inventory } from 'src/inventory/entities/inventory.entity';
import { SupplierMedicine } from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllMedicinesSupplier {
  name: string;
  category: string;
  id: number;
  quantity: number;
  constructor({ supplierMedicine }: { supplierMedicine: SupplierMedicine }) {
    this.id = supplierMedicine.id;
    this.name = supplierMedicine.medicine.name;
    this.category = supplierMedicine.medicine.category.category;
    this.quantity = supplierMedicine.quantity;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    quantity: number;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
    };
  }
}
