import { Module } from '@nestjs/common';
import { ComplaintService } from './services/complaint.service';
import { ComplaintController } from './api/complaint.controller';
import {
  PharmacyComplaint,
  SupplierComplaint,
  WarehouseComplaint,
} from './entities/role-complaint.entities';
import { AdminController } from 'src/admin/api/admin.controller';
import { ComplaintAdminService } from './services/complaint.admin.service';
import { ComplaintSupplierService } from './services/complaint.supplier.service';
import { ComplaintPharmacyService } from './services/complaint.pharmacy.service';
import { ComplaintWarehouseService } from './services/complaint.warehouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { ComplaintError } from './services/complaint-errors.service';
import { ComplaintAdminController } from './api/complaint.admin.controller';
import { ComplaintSupplierController } from './api/complaint.supplier.conroller';
import { ComplaintWarehouseController } from './api/complaint.warehouse.controller';
import { ComplaintPharmacyController } from './api/complaint.pharmacy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      Warehouse,
      Pharmacy,
      SupplierComplaint,
      WarehouseComplaint,
      PharmacyComplaint,
    ]),
  ],
  providers: [
    ComplaintService,
    ComplaintAdminService,
    ComplaintSupplierService,
    ComplaintWarehouseService,
    ComplaintPharmacyService,
    ComplaintError,
  ],
  controllers: [
    ComplaintController,
    ComplaintAdminController,
    ComplaintSupplierController,
    ComplaintWarehouseController,
    ComplaintPharmacyController,
  ],
})
export class ComplaintModule {}
