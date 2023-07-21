import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
}
