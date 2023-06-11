import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerDto';
import { Bcrypt } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) return null;
    const isMatch = await Bcrypt.comparePassword(pass, user.password);

    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }
  async logIn(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async signUp(user: RegisterDto) {
    const { email, username } = user;
    const oldUser = await this.userService.findOneByUsernameOrEmail(
      username,
      email,
    );
    if (oldUser)
      throw new BadRequestException('this user is already signed up');
    return this.userService.createOne(user);
  }
}
