import { Inventory } from 'src/inventory/entities/inventory.entity';

export class AdminGetByIdInventory {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userEmail: string;
  userFullName: string;
  constructor({ inventory }: { inventory: Inventory }) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.location = inventory.location;
    this.phoneNumber = inventory.phoneNumber;
    this.userEmail = inventory.manager.email;
    this.userFullName = inventory.manager.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    userEmail: string;
    userFullName: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      userEmail: this.userEmail,
      userFullName: this.userFullName,
    };
  }
}
