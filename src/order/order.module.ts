import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOrderService } from './services/order-warehouse.service';
import {
  WarehouseOrder,
  WarehouseOrderDetails,
} from './entities/order.entities';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { OrderWarehouesController } from './api/controllers/order-warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseOrder, WarehouseOrderDetails]),
    MedicineModule,
    SupplierModule,
  ],
  controllers: [OrderWarehouesController],
  providers: [WarehouseOrderService],
})
export class OrderModule {}
