import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './services/inventory.service';
import { Inventory } from './entities/inventory.entity';
import { MedicineModule } from 'src/medicine/medicine.module';
@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), MedicineModule],
  controllers: [],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
