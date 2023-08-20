import { throws } from 'assert';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllSuppliers {
  id: number;
  name: string;
  location: string;
  rating: number;
  phoneNumber: string;
  constructor({ supplier }: { supplier: Supplier }) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.location = supplier.location;
    this.rating = Math.round(supplier.rating);
    this.phoneNumber = supplier.phoneNumber;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    rating: number;
    phoneNumber: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      rating: this.rating,
      phoneNumber: this.phoneNumber,
    };
  }
}
