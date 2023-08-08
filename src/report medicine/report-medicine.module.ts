import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { DeliverModule } from 'src/deliver/deliver.module';
import {
  InventoryReportMedicine,
  InventoryReportMedicineDetails,
} from './entities/report-medicine.entities';
import { ReportMedicineWarehouesController } from './api/controllers/report-medicine-warehouse.controller';
import { ReportMedicineInventoryController } from './api/controllers/report-medicine-inventory.controller';
import { ReportMedicineError } from './services/report-medicine-error.service';
import { InventoryReportMedicineService } from './services/report-medicine-inventory.service';
import { WarehouseReportMedicineService } from './services/report-medicine-warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryReportMedicine,
      InventoryReportMedicineDetails,
    ]),
    MedicineModule,
    SupplierModule,
    forwardRef(() => DeliverModule),
  ],
  controllers: [
    ReportMedicineWarehouesController,
    ReportMedicineInventoryController,
  ],
  providers: [
    InventoryReportMedicineService,
    WarehouseReportMedicineService,
    ReportMedicineError,
  ],
})
export class ReportMedicineModule {}
