import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class InventoryAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  
}
