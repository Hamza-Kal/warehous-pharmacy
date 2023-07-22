import { Injectable } from '@nestjs/common';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { RegisterDto } from '../api/dto';
import { CreateWarehouseDto } from 'src/warehouse/api/dto/create-warehouse.dto';
import { WarehouseWebService } from 'src/warehouse/services/warehouse-web.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WarehouseAuthService {
  constructor(
    private userService: UserService,
    private warehouseWebService: WarehouseWebService,
    private jwtService: JwtService,
  ) {}

  async loginWarehouse(user: any) {
    const { role, id, completedAccount } = user;
    const payload = {
      id,
      role,
      completedAccount,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}
