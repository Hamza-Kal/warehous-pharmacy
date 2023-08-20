import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { LoginDto, RegisterDto } from '../api/dto';
import { Role } from 'src/shared/enums/roles';
import { hash, compare } from 'bcrypt';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { multicast } from 'rxjs';
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

    console.log(user);

    return result;
  }

  async register(body: RegisterDto) {
    const user = await this.userService.createOne(body);
    delete user.password;
    return {
      data: {
        id: user.id,
      },
    };
  }

  login(user: any) {
    const {
      role,
      id,
      completedAccount,
      pharmacy,
      inventory,
      warehouse,
      supplier,
    } = user;
    const payload: {
      id: number;
      role: Role;
      completedAccount: boolean;
      pharmacyId?: number;
      warehouseId?: number;
      inventoryId?: number;
      supplierId?: number;
    } = {
      id,
      role,
      completedAccount,
      pharmacyId: pharmacy ? pharmacy.id : null,
      inventoryId: inventory ? inventory.id : null,
      supplierId: supplier ? supplier.id : null,
      warehouseId: warehouse ? warehouse.id : null,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
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
