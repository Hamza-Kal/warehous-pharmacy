import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseReturnOrderService } from './services/returnOrder-warehouse.service';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from './entities/returnOrder.entities';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ReturnOrderWarehouseController } from './api/controllers/returnOrder-warehouse.controller';
import { ReturnOrderSupplierController } from './api/controllers/returnOrder-supplier.controller';
import { SupplierReturnOrderService } from './services/returnOrder-supplier.service';
import { ReturnOrderError } from './services/returnOrder-error.service';
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { DeliverModule } from 'src/deliver/deliver.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseReturnOrder,
      WarehouseReturnOrderDetails,
      WarehouseMedicineDetails,
    ]),
    MedicineModule,
    SupplierModule,
    forwardRef(() => DeliverModule),
    PaymentModule,
  ],
  controllers: [ReturnOrderWarehouseController, ReturnOrderSupplierController],
  providers: [
    WarehouseReturnOrderService,
    SupplierReturnOrderService,
    ReturnOrderError,
  ],
})
export class ReturnOrderModule {}
