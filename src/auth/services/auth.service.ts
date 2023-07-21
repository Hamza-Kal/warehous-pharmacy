import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { LoginDto, RegisterDto } from '../api/dto';
import { Role } from 'src/shared/enums/roles';
import { hash, compare } from 'bcrypt';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private warehouseService: WarehouseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;
    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;

    return result;
  }

  async register(body: RegisterDto) {
    const user = await this.userService.createOne(body);
    delete user.password;
    return {
      id: user.id,
    };
  }
  async login(user: any, requiredRole: Role) {
    const { username, role, id, completedAccount } = user;
    this.validateRole(role, requiredRole);
    const payload = {
      username,
      id,
      role,
      completedAccount,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
  async loginWarehouse(user: any) {
    const { username, role, id } = user;
    const payload = {
      username,
      id,
      role,
      createdAccount: false,
    };
    const warehouse = await this.warehouseService.findOne(id);
    warehouse
      ? (payload.createdAccount = true)
      : (payload.createdAccount = false);
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }

  private validateRole(userRole: Role, requiredRole: Role) {
    if (userRole === Role.GUEST)
      throw new HttpException('user is still a guest', HttpStatus.BAD_REQUEST);
    if (userRole !== requiredRole)
      throw new HttpException(
        'user role is not authorized',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    return;
  }
}
