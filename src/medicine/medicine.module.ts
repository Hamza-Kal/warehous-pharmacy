import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from './entities/medicine.entities';
import {
  InventoryMedicine,
  PharmacyMedicine,
  PharmacyMedicinePrice,
  SupplierMedicine,
  WarehouseMedicine,
  WarehouseMedicinePrice,
} from './entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { MedicineController } from './api/controller/medicine-dashboard-supplier.controller';
import { MedicineError } from './services/medicine-error.service';
import { MedicineSupplierService } from './services/medicine-supplier.service';
import { WarehouseMedicineService } from './services/medicine-warehouse.service';
import { MedicineWarehouseController } from './api/controller/medicine-warehouse.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineDetails,
      InventoryMedicine,
      PharmacyMedicine,
      PharmacyMedicinePrice,
      WarehouseMedicinePrice,
      WarehouseMedicine,
      SupplierMedicine,
      Category,
    ]),
  ],
  controllers: [MedicineController, MedicineWarehouseController],
  providers: [MedicineSupplierService, WarehouseMedicineService, MedicineError],
  exports: [],
})
export class MedicineModule {}
