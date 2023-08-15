import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from './entities/medicine.entities';
import {
  InventoryMedicine,
  InventoryMedicineDetails,
  PharmacyMedicine,
  PharmacyMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from './entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { MedicineController } from './api/controller/medicine-dashboard-supplier.controller';
import { MedicineError } from './services/medicine-error.service';
import { MedicineSupplierService } from './services/medicine-supplier.service';
import { WarehouseMedicineService } from './services/medicine-warehouse.service';
import { MedicineWarehouseController } from './api/controller/medicine-warehouse.controller';
import { MedicineService } from './services/medicine.service';
import { WarehouseOrderDetails } from 'src/order/entities/order.entities';
import { InventoryModule } from 'src/inventory/inventory.module';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { OrderModule } from 'src/order/order.module';
import { DeliverModule } from 'src/deliver/deliver.module';
import { MedicineInventoryService } from './services/medicine-inventory.service';
import { MedicineInventoryController } from './api/controller/medicine-inventory.controller';
import { Media } from 'src/media/entities/media.entity';
import { CategoryController } from './api/controller/medicine-all.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineDetails,
      SupplierMedicine,
      SupplierMedicineDetails,
      InventoryMedicine,
      PharmacyMedicine,
      WarehouseMedicine,
      InventoryMedicineDetails,
      PharmacyMedicineDetails,
      WarehouseMedicineDetails,
      WarehouseOrderDetails,
      Category,
      Inventory,
      Media,
    ]),
    DeliverModule,
  ],
  controllers: [
    MedicineController,
    MedicineWarehouseController,
    MedicineInventoryController,
    CategoryController,
  ],
  providers: [
    MedicineSupplierService,
    WarehouseMedicineService,
    MedicineError,
    MedicineService,
    MedicineInventoryService,
  ],
  exports: [MedicineService, MedicineError, WarehouseMedicineService],
})
export class MedicineModule {}
