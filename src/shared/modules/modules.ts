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
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { MedicineModule } from 'src/medicine/medicine.module';
import {
  Category,
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import {
  InventoryMedicine,
  PharmacyMedicine,
  PharmacyMedicinePrice,
  SupplierMedicine,
  WarehouseMedicine,
  WarehouseMedicinePrice,
} from 'src/medicine/entities/medicine-role.entities';
import {
  PharmacyOrders,
  WarehouseOrders,
} from 'src/order/entities/order.entities';

export const Modules = [
  WarehouseModule,
  UserModule,
  AuthModule,
  InventoryModule,
  PharmacyModule,
  SupplierModule,
  MedicineModule,
];

export const entities = [
  User,
  Warehouse,
  Inventory,
  Pharmacy,
  Supplier,
  Medicine,
  MedicineDetails,
  PharmacyMedicine,
  SupplierMedicine,
  InventoryMedicine,
  WarehouseMedicine,
  PharmacyMedicinePrice,
  WarehouseMedicinePrice,
  WarehouseOrders,
  Category,
  PharmacyOrders,
];
