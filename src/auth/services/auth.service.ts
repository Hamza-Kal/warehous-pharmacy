import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { comparePassword } from 'src/shared/utils/bcrypt';
import { LoginDto, RegisterDto } from '../api/dto';

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

  async register(user: RegisterDto) {
    const newUser = await this.userService.createOne(user);
    const payload = {
      username: newUser.username,
      id: newUser.id,
      role: newUser.role,
    };
    console.log(newUser);
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
