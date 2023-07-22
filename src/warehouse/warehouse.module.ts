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
@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, User, Inventory]),
    UserModule,
    jwtModule,
    UserModule,
    InventoryModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseWebService, WarehouseService],
  exports: [WarehouseService, WarehouseWebService],
})
export class WarehouseModule {}
