import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOrderService } from './services/order-warehouse.service';
import {
  DistributionPharmacyOrder,
  DistributionWarehouseOrder,
  PharmacyFastOrder,
  PharmacyFastOrderDetails,
  PharmacyOrder,
  PharmacyOrderDetails,
  WarehouseOrder,
  WarehouseOrderDetails,
} from './entities/order.entities';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { OrderWarehouseController } from './api/controllers/order-warehouse.controller';
import { OrderSupplierController } from './api/controllers/order-supplier.controller';
import { SupplierOrderService } from './services/order-supplier.service';
import { OrderError } from './services/order-error.service';
import { DeliverModule } from 'src/deliver/deliver.module';
import { PharmacyOrderService } from './services/order-pharmacy.service';
import { OrderPharmacyController } from './api/controllers/order-pharmacy.controller';
import { OrderService } from './services/order.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseOrder,
      WarehouseOrderDetails,
      DistributionWarehouseOrder,
      PharmacyOrder,
      PharmacyOrderDetails,
      DistributionPharmacyOrder,
      PharmacyFastOrder,
      PharmacyFastOrderDetails,
    ]),
    MedicineModule,
    SupplierModule,
    DeliverModule,
    PaymentModule,
  ],
  controllers: [
    OrderWarehouseController,
    OrderSupplierController,
    OrderPharmacyController,
  ],
  providers: [
    WarehouseOrderService,
    SupplierOrderService,
    OrderService,
    OrderError,
    PharmacyOrderService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
