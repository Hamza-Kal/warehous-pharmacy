import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class PharmacyAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  loginPharmacy({ id, role, completedAccount }) {
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
