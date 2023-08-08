import { User } from 'src/user/entities/user.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetByIdWarehouse {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  owner: User;
  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.phoneNumber = warehouse.phoneNumber;
    this.owner = warehouse.owner;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    owner: User;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      owner: this.owner,
    };
  }
}
