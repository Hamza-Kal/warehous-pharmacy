import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InventoryMedicine,
  InventoryMedicineDetails,
  PharmacyMedicine,
  PharmacyMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import {
  Category,
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { WarehouseOrderDetails } from 'src/order/entities/order.entities';
import { DeliverService } from './service/deliver.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineDetails,
      SupplierMedicine,
      SupplierMedicineDetails,
      InventoryMedicine,
      PharmacyMedicine,
      WarehouseMedicine,
      InventoryMedicineDetails,
      PharmacyMedicineDetails,
      WarehouseMedicineDetails,
      WarehouseOrderDetails,
      Category,
    ]),
  ],

  providers: [DeliverService],
  exports: [DeliverService],
})
export class DeliverModule {}
