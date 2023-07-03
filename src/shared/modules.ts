import { AuthModule } from 'src/auth/auth.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { UserModule } from 'src/user/user.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';

export default [
  UserModule,
  AuthModule,
  WarehouseModule,
  InventoryModule,
  PharmacyModule,
  SupplierModule,
];
