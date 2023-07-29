import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/shared/interface/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `faek`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload)
      throw new HttpException('expired token', HttpStatus.UNAUTHORIZED);
    return {
      id: payload.id,
      role: payload.role,
      completedAccount: payload.completedAccount,

      pharmacyId: payload.pharmacyId,
      warehouseId: payload.warehouseId,
      inventoryId: payload.inventoryId,
      supplierId: payload.supplierId,
    };
  }
}
