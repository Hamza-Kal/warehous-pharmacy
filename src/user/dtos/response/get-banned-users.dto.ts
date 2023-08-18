import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Role } from 'src/shared/enums/roles';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetBannedUsersDto {
  id: number;
  email: string;
  assignedRole: Role;
  fullName: string;
  property: Warehouse | Supplier | Inventory | Pharmacy | null;
  constructor({ user }: { user: User }) {
    this.id = user.id;
    this.email = user.email;
    this.assignedRole = user.assignedRole;
    this.fullName = user.fullName;
    // if (user.warehouse) this.property = user.warehouse;
    // if (user.supplier) this.property = user.supplier;
    // if (user.inventory) this.property = user.inventory;
    // if (user.pharmacy) this.property = user.pharmacy;
    this.property =
      user.warehouse || user.supplier || user.inventory || user.pharmacy;
  }

  toObject(): {
    id: number;
    email: string;
    status: string;
    assignedRole: Role;
    fullName: string;
    property: Warehouse | Supplier | Inventory | Pharmacy | null;
  } {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      assignedRole: this.assignedRole,
      property: this.property,
      status: 'banned',
    };
  }
}
