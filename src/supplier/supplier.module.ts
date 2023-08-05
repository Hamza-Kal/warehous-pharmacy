import { Module } from '@nestjs/common';
import { SupplierController } from './api/controller/supplier.controller';
import { SupplierDashboardService } from './service/supplier-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { UserModule } from 'src/user/user.module';
import { SupplierService } from './service/supplier.service';
import { MedicineModule } from 'src/medicine/medicine.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierDashboardService, SupplierService],
  imports: [TypeOrmModule.forFeature([Supplier]), UserModule, MedicineModule],
  exports: [SupplierService],
})
export class SupplierModule {}
