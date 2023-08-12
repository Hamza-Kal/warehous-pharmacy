import { Module } from '@nestjs/common';
import { AdminController } from './api/admin.controller';
import { AdminService } from './service/admin.service';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { MedicineModule } from 'src/medicine/medicine.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Warehouse, Inventory, Pharmacy]),
    WarehouseModule,
    PharmacyModule,
    InventoryModule,
    SupplierModule,
    MedicineModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
