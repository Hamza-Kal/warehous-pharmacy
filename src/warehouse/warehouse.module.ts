import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class WarehouseModule {}
