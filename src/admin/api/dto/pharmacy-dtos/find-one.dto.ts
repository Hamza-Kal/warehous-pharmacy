import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
export class AdminGetByIdPharmacy {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  constructor({ pharmacy }: { pharmacy: Pharmacy }) {
    this.id = pharmacy.id;
    this.name = pharmacy.name;
    this.location = pharmacy.location;
    this.phoneNumber = pharmacy.phoneNumber;
    this.userId = pharmacy.user.id;
    this.userEmail = pharmacy.user.email;
    this.userFullName = pharmacy.user.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    userFullName: string;
    userId: number;
    userEmail: string;
    status: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      userEmail: this.userEmail,
      userId: this.userId,
      userFullName: this.userFullName,
      status: 'active',
    };
  }
}
