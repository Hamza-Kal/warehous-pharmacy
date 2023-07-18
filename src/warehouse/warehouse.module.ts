import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './api/controller/warehouse-web.controller';
import { WarehouseWebService } from './services/warehouse-web.service';
import { Warehouse } from './entities/warehouse.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MongoUnexpectedServerResponseError } from 'typeorm';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [TypeOrmModule.forFeature([Warehouse]), UserModule],
  controllers: [WarehouseController],
  providers: [WarehouseWebService],
})
export class WarehouseModule {}
