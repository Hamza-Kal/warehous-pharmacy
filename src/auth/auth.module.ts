import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './api/controller/auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminAuthService } from './services/admin.auth..service';
import { PharmacyAuthService } from './services/pharmacy.auth.service';
import { WarehouseAuthService } from './services/warehouse.auth.service';
import { InventoryAuthService } from './services/inventory.auth.service';
import { SupplierAuthService } from './services/supplier.auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '180h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminAuthService,
    PharmacyAuthService,
    WarehouseAuthService,
    InventoryAuthService,
    SupplierAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
