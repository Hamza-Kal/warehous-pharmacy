import { Inventory } from 'src/inventory/entities/inventory.entity';
import { User } from 'src/user/entities/user.entity';

export class GetByIdInventory {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  manager: User;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
    this.manager = inventory.manager;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    manager: User;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      manager: this.manager,
    };
  }
}
