import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllInventories {
  name: string;
  location: string;
  phoneNumber: string;
  fullName: string;
  id: number;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
    this.fullName = inventory.manager.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    managerName: string;
  } {
    return {
      id: this.id,
      managerName: this.fullName,
      name: this.name,
      phoneNumber: this.phoneNumber,
      location: this.location,
    };
  }
}
