import {
  Body,
  Controller,
  applyDecorators,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginDto, RegisterDto } from '../dto';
import { Role } from 'src/shared/enums/roles';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseAuthService } from 'src/auth/services/warehouse.auth.service';
import { InventoryAuthService } from 'src/auth/services/inventory.auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private warehouseAuthService: WarehouseAuthService,
    private inventoryAuthService: InventoryAuthService,
  ) {}

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

  //TODO refactor login to make it only accept of same type and after completing the account
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login-admin')
  async loginAdmin(@CurrUser() user: any) {
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login-warehouse')
  async loginWarehouse(@CurrUser() user: IUser) {
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login-supplier')
  async loginSupplier(@CurrUser() user: IUser) {
    return this.authService.login(user);
  }
}
