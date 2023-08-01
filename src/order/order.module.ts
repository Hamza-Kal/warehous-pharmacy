import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOrderService } from './services/order-warehouse.service';
import {
  WarehouseOrder,
  WarehouseOrderDetails,
} from './entities/order.entities';
import { MedicineModule } from 'src/medicine/medicine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseOrder, WarehouseOrderDetails]),
    MedicineModule,
  ],
  controllers: [],
  providers: [WarehouseOrderService],
})
export class OrderModule {}
