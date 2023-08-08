import { Inventory } from 'src/inventory/entities/inventory.entity';

export class GetByIdInventory {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  managerEmail: string;
  managerFullName: string;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
    this.managerEmail = inventory.manager.email;
    this.managerFullName = inventory.manager.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    managerEmail: string;
    managerFullName: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      managerEmail: this.managerEmail,
      managerFullName: this.managerFullName,
    };
  }
}
