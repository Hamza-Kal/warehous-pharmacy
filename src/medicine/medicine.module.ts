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
  SupplierMedicine,
  WarehouseMedicine,
} from './entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { MedicineController } from './api/controller/medicine-dashboard-supplier.controller';
import { MedicineError } from './services/medicine-error.service';
import { MedicineSupplierService } from './services/medicine-supplier.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineDetails,
      InventoryMedicine,
      PharmacyMedicine,
      WarehouseMedicine,
      SupplierMedicine,
      Category,
    ]),
  ],
  controllers: [MedicineController],
  providers: [MedicineSupplierService, MedicineError],
  exports: [],
})
export class MedicineModule {}
