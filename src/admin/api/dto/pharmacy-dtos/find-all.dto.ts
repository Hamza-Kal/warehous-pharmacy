import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

export class AdminGetAllPharmacies {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  constructor({ pharmacy }: { pharmacy: Pharmacy }) {
    this.id = pharmacy.id;
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.phoneNumber = pharmacy.phoneNumber;
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
