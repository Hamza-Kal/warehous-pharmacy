import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { password } from '../ormconfig.json';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Warehouse } from './warehouse/entities/warehouse.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { Pharmacy } from './pharmacy/entities/pharmacy.entity';
import { Medicine } from './db-entities/medicine-entity/medicine.entity';
import { Medicine_Warehouse } from './db-entities/medicine-entity/medicine-warehouse.entity';
import { Medicine_Pharmacy } from './db-entities/medicine-entity/medicine-pharmacy.entity';
import { Supplier } from './supplier/entities/supplier.entity';
import { Medicine_Supplier } from './db-entities/medicine-entity/medicine-supplier.entity';
import { Medicine_Inventory } from './db-entities/medicine-entity/medicine-inventory.entity';
import { PendingOrder_Pharmacy } from './db-entities/pendingOrder-entity/pendingOrder-pharmacy.entity';
import { PendingOrder_Supplier } from './db-entities/pendingOrder-entity/pendingOrder-supplier.entity';
import Modules from './shared/modules';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password,
      database: 'mkhzan',
      entities: [
        User,
        Warehouse,
        Inventory,
        Pharmacy,
        Medicine,
        Supplier,
        Medicine_Warehouse,
        Medicine_Pharmacy,
        Medicine_Supplier,
        Medicine_Inventory,
        PendingOrder_Pharmacy,
        PendingOrder_Supplier,
      ],
      synchronize: true,
    }),
    ...Modules,
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
