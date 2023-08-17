import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './api/controller/warehouse-web.controller';
import { WarehouseWebService } from './services/warehouse-web.service';
import { Warehouse } from './entities/warehouse.entity';
import { UserModule } from 'src/user/user.module';
import { WarehouseService } from './services/warehouse.service';
import jwtModule from 'src/shared/jwt/jwt.module';
import { User } from 'src/user/entities/user.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { SupplierModule } from 'src/supplier/supplier.module';
import { MedicineModule } from 'src/medicine/medicine.module';
import { WarehouseError } from './services/warehouse-error.service';
import { WarehousePharmacyService } from './services/warehouse-pharmacy.service';
import { PharmacyWarehouseController } from './api/controller/pharmacy.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, User, Inventory]),
    UserModule,
    jwtModule,
    UserModule,
    InventoryModule,
    SupplierModule,
    MedicineModule,
  ],
  controllers: [WarehouseController, PharmacyWarehouseController],
  providers: [
    WarehouseWebService,
    WarehouseService,
    WarehouseError,
    WarehousePharmacyService,
  ],
  exports: [WarehouseService, WarehouseWebService],
})
export class WarehouseModule {}
