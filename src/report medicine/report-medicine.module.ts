import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import {
  InventoryMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { DeliverModule } from 'src/deliver/deliver.module';
import {
  InventoryReportMedicine,
  PharmacyReportMedicine,
} from './entities/report-medicine.entities';
import { ReportMedicineWarehouseController } from './api/controllers/report-medicine-warehouse.controller';
import { ReportMedicineInventoryController } from './api/controllers/report-medicine-inventory.controller';
import { ReportMedicineError } from './services/report-medicine-error.service';
import { InventoryReportMedicineService } from './services/report-medicine-inventory.service';
import { WarehouseReportMedicineService } from './services/report-medicine-warehouse.service';
import { PharmacyReportMedicineController } from './api/controllers/report-medicine-pharmacy.controller';
import { PharmacyReportMedicineService } from './services/report-medicine-pharmacy.service';
import { OrderService } from 'src/order/services/order.service';
import { OrderModule } from 'src/order/order.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryReportMedicine, PharmacyReportMedicine]),
    MedicineModule,
    SupplierModule,
    forwardRef(() => DeliverModule),
    OrderModule,
    PaymentModule,
  ],
  controllers: [
    ReportMedicineWarehouseController,
    ReportMedicineInventoryController,
    PharmacyReportMedicineController,
  ],
  providers: [
    InventoryReportMedicineService,
    WarehouseReportMedicineService,
    PharmacyReportMedicineService,
    ReportMedicineError,
  ],
})
export class ReportMedicineModule {}
