import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Role } from '../enums/roles';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

export interface IUser {
  email: string;
  id: number;
  role: Role;
  supplierId?: Supplier | number;
  warehouseId?: Warehouse | number;
  pharmacyId?: Pharmacy | number;
  inventoyId?: Inventory | number;
}
