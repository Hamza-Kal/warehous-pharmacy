import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOrderService } from './services/order-warehouse.service';
import {
  DistributionWarehouseOrder,
  WarehouseOrder,
  WarehouseOrderDetails,
} from './entities/order.entities';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { OrderWarehouesController } from './api/controllers/order-warehouse.controller';
import { OrderSupplierController } from './api/controllers/order-supplier.controller';
import { SupplierOrderService } from './services/order-supplier.service';
import { OrderError } from './services/order-error.service';
import { DeliverModule } from 'src/deliver/deliver.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseOrder,
      WarehouseOrderDetails,
      DistributionWarehouseOrder,
    ]),
    MedicineModule,
    SupplierModule,
    DeliverModule,
  ],
  controllers: [OrderWarehouesController, OrderSupplierController],
  providers: [WarehouseOrderService, SupplierOrderService, OrderError],
})
export class OrderModule {}
