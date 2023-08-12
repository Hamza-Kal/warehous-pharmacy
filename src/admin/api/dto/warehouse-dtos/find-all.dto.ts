import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class AdminGetAllWarehouses {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.phoneNumber = warehouse.phoneNumber;
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
      location: this.location,
      phoneNumber: this.phoneNumber,
    };
  }
}
