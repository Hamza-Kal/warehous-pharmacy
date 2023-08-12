import { Inventory } from 'src/inventory/entities/inventory.entity';

export class AdminGetAllInventories {
  name: string;
  location: string;
  phoneNumber: string;
  id: number;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
  } {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      location: this.location,
    };
  }
}
