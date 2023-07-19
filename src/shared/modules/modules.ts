import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { UserModule } from 'src/user/user.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { User } from 'src/user/entities/user.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Medicine } from 'src/db-entities/medicine-entity/medicine.entity';
import { Medicine_Warehouse } from 'src/db-entities/medicine-entity/medicine-warehouse.entity';
import { Medicine_Pharmacy } from 'src/db-entities/medicine-entity/medicine-pharmacy.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Medicine_Supplier } from 'src/db-entities/medicine-entity/medicine-supplier.entity';
import { Medicine_Inventory } from 'src/db-entities/medicine-entity/medicine-inventory.entity';
import { PendingOrder_Pharmacy } from 'src/db-entities/pendingOrder-entity/pendingOrder-pharmacy.entity';
import { PendingOrder_Supplier } from 'src/db-entities/pendingOrder-entity/pendingOrder-supplier.entity';

export const Modules = [
  UserModule,
  AuthModule,
  WarehouseModule,
  InventoryModule,
  PharmacyModule,
  SupplierModule,
];

export const entities = [
  User,
  Warehouse,
  Inventory,
  Pharmacy,
  Medicine,
  Supplier,
  Medicine_Warehouse,
  Medicine_Pharmacy,
  Medicine_Supplier,
  Medicine_Inventory,
  PendingOrder_Pharmacy,
  PendingOrder_Supplier,
];
