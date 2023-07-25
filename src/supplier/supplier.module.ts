import { Module } from '@nestjs/common';
import { SupplierController } from './api/controller/supplier.controller';
import { SupplierDashboardService } from './service/supplier-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierDashboardService],
  imports: [TypeOrmModule.forFeature([Supplier]), UserModule],
})
export class SupplierModule {}
