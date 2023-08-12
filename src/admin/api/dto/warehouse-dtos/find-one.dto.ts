import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class AdminGetByIdWarehouse {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  ownerFullName: string;
  ownerEmail: string;
  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.phoneNumber = warehouse.phoneNumber;
    this.ownerEmail = warehouse.owner.email;
    this.ownerFullName = warehouse.owner.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    ownerFullName: string;
    ownerEmail: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      ownerEmail: this.ownerEmail,
      ownerFullName: this.ownerFullName,
    };
  }
}
