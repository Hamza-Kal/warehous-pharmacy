import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { RegisterDto } from './dto/registerDto';
import { comparePassword } from 'src/shared/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) return null;
    const isMatch = await comparePassword(pass, user.password);

    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }
  // async login(user: any) {
  //   const payload = { username: user.username, id: user.id, role:  };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
  async signup(user: RegisterDto) {
    const newUser = await this.userService.createOne(user);
    const payload = {
      username: newUser.username,
      id: newUser.id,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }

  async changePassword(user: any, oldPassword: string, newPassword: string) {
    if (oldPassword === newPassword) {
      throw new HttpException(
        'new password must not be like the old one',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedUser = await this.userService.findOneById(user.id);
  }
}
