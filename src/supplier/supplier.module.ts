import { Module } from '@nestjs/common';
import { SupplierController } from './api/controller/supplier.controller';
import { SupplierDashboardService } from './service/supplier-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { UserModule } from 'src/user/user.module';
import { SupplierService } from './service/supplier.service';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierError } from './service/supplier-error.service';
import { SupplierWarehouseController } from './api/controller/warehouse.controller';
import { SupplierWarehouseService } from './service/supplier-warehouse.service';

@Module({
  controllers: [SupplierController, SupplierWarehouseController],
  providers: [
    SupplierDashboardService,
    SupplierService,
    SupplierError,
    SupplierWarehouseService,
  ],
  imports: [TypeOrmModule.forFeature([Supplier]), UserModule, MedicineModule],
  exports: [SupplierService, SupplierError],
})
export class SupplierModule {}
