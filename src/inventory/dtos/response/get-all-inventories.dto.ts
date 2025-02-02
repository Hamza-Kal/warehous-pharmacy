import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllInventories {
  name: string;
  location: string;
  phoneNumber: string;
  id: number;
  managerName: string;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
    this.managerName = inventory.manager.fullName;
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
      name: this.name,
      phoneNumber: this.phoneNumber,
      location: this.location,
      managerName: this.managerName,
    };
  }
}
