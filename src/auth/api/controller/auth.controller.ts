import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { RegisterDto } from '../dto';
import { Role } from 'src/shared/enums/roles';

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
  @Post('inventory-register')
  async registerInventory(@Body() body: RegisterDto) {
    body.assignedRole = Role.INVENTORY;
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
}
