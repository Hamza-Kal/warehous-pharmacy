import { Module } from '@nestjs/common';
import { AdminController } from './api/admin.controller';
import { AdminService } from './service/admin.service';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [WarehouseModule, PharmacyModule, InventoryModule, SupplierModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
