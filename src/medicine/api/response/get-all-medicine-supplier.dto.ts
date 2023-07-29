import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllMedicinesSupplier {
  name: string;
  category: string;
  id: number;
  constructor({ medicine }: { medicine: Medicine }) {
    this.id = medicine.id;
    this.name = medicine.name;
    this.category = medicine.category.category;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
    };
  }
}
