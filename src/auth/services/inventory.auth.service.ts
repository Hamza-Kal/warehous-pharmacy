import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { InventroyRegister } from '../api/dto/register.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@Injectable()
export class InventoryAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(body: InventroyRegister, user: IUser) {
    let inventoryAccount: {
      email: string;
      password: string;
      fullName: string;
    };

    inventoryAccount = ...body;
  }
}
