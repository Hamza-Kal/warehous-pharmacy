import { Supplier } from 'src/supplier/entities/supplier.entity';

export class AdminGetByIdSupplier {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userFullName: string;
  userEmail: string;
  constructor({ supplier }: { supplier: Supplier }) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.location = supplier.location;
    this.phoneNumber = supplier.phoneNumber;
    this.userEmail = supplier.user.email;
    this.userFullName = supplier.user.fullName;
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
