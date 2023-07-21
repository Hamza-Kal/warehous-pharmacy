import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginDto, RegisterDto } from '../dto';
import { Role } from 'src/shared/enums/roles';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { IUser } from 'src/shared/interface/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin-register')
  async registerAdmin(@Body() body: RegisterDto) {
    body.assignedRole = Role.ADMIN;
    return this.authService.register(body);
  }
  @Post('pharmacy-register')
  async registerPharmacy(@Body() body: RegisterDto) {
    body.assignedRole = Role.PHARMACY;
    return this.authService.register(body);
  }

  @Post('warehouse-register')
  async registerWarehouse(@Body() body: RegisterDto) {
    body.assignedRole = Role.WAREHOUSE;
    return this.authService.register(body);
  }

  @Post('supplier-register')
  async registerSupplier(@Body() body: RegisterDto) {
    body.assignedRole = Role.SUPPLIER;
    return this.authService.register(body);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login-admin')
  async loginAdmin(@CurrUser() user: any) {
    console.log(user);
    return this.authService.login(user, Role.ADMIN);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login-warehouse')
  async loginWarehouse(@CurrUser() user: IUser) {
    return this.authService.loginWarehouse(user);
  }
}
