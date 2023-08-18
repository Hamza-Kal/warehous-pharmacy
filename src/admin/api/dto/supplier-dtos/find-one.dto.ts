import { Supplier } from 'src/supplier/entities/supplier.entity';

export class AdminGetByIdSupplier {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  userFullName: string;
  userId: number;
  userEmail: string;
  constructor({ supplier }: { supplier: Supplier }) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.location = supplier.location;
    this.phoneNumber = supplier.phoneNumber;
    this.userId = supplier.user.id;
    this.userEmail = supplier.user.email;
    this.userFullName = supplier.user.fullName;
  }

  toObject(): {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
    userFullName: string;
    userId: number;
    userEmail: string;
  } {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      userId: this.userId,
      userEmail: this.userEmail,
      userFullName: this.userFullName,
    };
  }
}
