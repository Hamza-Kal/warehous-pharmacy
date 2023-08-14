import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class AdminGetByIdWarehouse {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userFullName: string;
  userEmail: string;
  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.phoneNumber = warehouse.phoneNumber;
    this.userEmail = warehouse.owner.email;
    this.userFullName = warehouse.owner.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    userFullName: string;
    userEmail: string;
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
