import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PharmacyWebService } from './services/pharmacy-web.service';
import { PharmacyController } from './api/controller/pharmacy.controller';
import { Pharmacy } from './entities/pharmacy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyService } from './services/pharmacy.service';
import { MedicineModule } from 'src/medicine/medicine.module';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { PharmacyWarehouseController } from './api/controller/warehouse.controller';
import { PharmacyWarehouseService } from './services/warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pharmacy, Warehouse]),
    UserModule,
    MedicineModule,
  ],
  controllers: [PharmacyController, PharmacyWarehouseController],
  providers: [PharmacyWebService, PharmacyService, PharmacyWarehouseService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
