import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllWarehousesPharmacy {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  rating: number;
  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.phoneNumber = warehouse.phoneNumber;
    this.rating = Math.round(warehouse.rating);
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    rating: number;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      rating: this.rating,
    };
  }
}
