import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
export class GetByIdPharmacy {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userFullName: string;
  userEmail: string;
  constructor({ pharmacy }: { pharmacy: Pharmacy }) {
    this.id = pharmacy.id;
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.phoneNumber = pharmacy.phoneNumber;
    this.userEmail = pharmacy.user.email;
    this.userFullName = pharmacy.user.fullName;
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
