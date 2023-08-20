import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Role } from '../enums/roles';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { User } from 'src/user/entities/user.entity';

export interface IUser {
  email: string;
  id: number;
  role: Role;
  supplierId?: number | Supplier;
  warehouseId?: number | Warehouse;
  pharmacyId?: number | Pharmacy;
  inventoryId?: number | Inventory;
}
