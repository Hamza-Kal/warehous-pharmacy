import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './services/inventory.service';
import { Inventory } from './entities/inventory.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
