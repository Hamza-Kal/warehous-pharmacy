import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { password } from '../ormconfig.json';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { Warehouse } from './warehouse/entities/warehouse.entity';
import { InventoryModule } from './inventory/inventory.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { SupplierModule } from './supplier/supplier.module';
import { Inventory } from './inventory/entities/inventory.entity';
import { Pharmacy } from './pharmacy/entities/pharmacy.entity';
import { Medicine } from './global-entities/medicine.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password,
      database: 'mkhzan',
      entities: [User, Warehouse, Inventory, Pharmacy, Medicine],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    WarehouseModule,
    InventoryModule,
    PharmacyModule,
    SupplierModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
