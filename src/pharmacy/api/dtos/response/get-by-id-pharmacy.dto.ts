import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { User } from 'src/user/entities/user.entity';

export class GetByIdPharmacy {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  user: User;
  constructor({ pharmacy }: { pharmacy: Pharmacy }) {
    this.id = pharmacy.id;
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.phoneNumber = pharmacy.phoneNumber;
    this.user = pharmacy.user;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    user: User;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      user: this.user,
    };
  }
}
