import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserDashboardController } from './api/user-dashboard-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import JwtModule from 'src/shared/jwt/jwt.module';
import { Media } from 'src/media/entities/media.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Media,
      Supplier,
      Warehouse,
      Inventory,
      Pharmacy,
    ]),
    JwtModule,
  ],
  exports: [UserService],
  controllers: [UserDashboardController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
