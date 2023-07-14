import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { LoginDto, RegisterDto } from '../api/dto';
import { Role } from 'src/shared/enums/roles';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
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

  async register(user: RegisterDto) {
    const newUser = await this.userService.createOne(user);
    return newUser;
  }
  async login(user: any, requiredRole: Role) {
    const { username, role, id } = user;

    this.validateRole(role, requiredRole);
    const payload = {
      username,
      id,
      role,
    };
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
