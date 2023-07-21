import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './api/controller/auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminAuthService } from './services/admin.auth.service';
import { PharmacyAuthService } from './services/pharmacy.auth.service';
import { WarehouseAuthService } from './services/warehouse.auth.service';
import { InventoryAuthService } from './services/inventory.auth.service';
import { SupplierAuthService } from './services/supplier.auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import jwtModule from 'src/shared/jwt/jwt.module';
import { WarehouseAuthController } from './api/controller/warehouse-auth.controller';
import { WarehouseModule } from 'src/warehouse/warehouse.module';

@Module({
  imports: [UserModule, WarehouseModule, PassportModule, jwtModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminAuthService,
    PharmacyAuthService,
    WarehouseAuthService,
  ],
  controllers: [AuthController, WarehouseAuthController],
})
export class AuthModule {}
