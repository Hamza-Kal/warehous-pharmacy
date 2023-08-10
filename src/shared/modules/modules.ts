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
  InventoryMedicineDetails,
  PharmacyMedicine,
  PharmacyMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import {
  DistributionWarehouseOrder,
  WarehouseOrder,
  WarehouseOrderDetails,
} from 'src/order/entities/order.entities';
import { OrderModule } from 'src/order/order.module';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from 'src/return order/entities/returnOrder.entities';
import { ReturnOrderModule } from 'src/return order/returnOrder.module';
import { InventoryReportMedicine } from 'src/report medicine/entities/report-medicine.entities';
import { ReportMedicineModule } from 'src/report medicine/report-medicine.module';

export const Modules = [
  WarehouseModule,
  UserModule,
  AuthModule,
  InventoryModule,
  PharmacyModule,
  SupplierModule,
  MedicineModule,
  OrderModule,
  ReturnOrderModule,
  ReportMedicineModule,
];

export const entities = [
  User,
  Warehouse,
  Inventory,
  Pharmacy,
  Supplier,
  Medicine,
  MedicineDetails,
  InventoryMedicine,
  SupplierMedicine,
  WarehouseMedicine,
  PharmacyMedicine,
  InventoryMedicineDetails,
  PharmacyMedicineDetails,
  SupplierMedicineDetails,
  WarehouseMedicineDetails,
  Category,
  WarehouseOrder,
  WarehouseOrderDetails,
  DistributionWarehouseOrder,
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
  InventoryReportMedicine,
];
