import { throws } from 'assert';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetByIdSupplier {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  user: User;
  constructor({ supplier }: { supplier: Supplier }) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.location = supplier.location;
    this.phoneNumber = supplier.phoneNumber;
    this.user = supplier.user;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    user: User;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      user: this.user,
    };
  }
}
