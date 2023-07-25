import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers['authorization']?.split(' ')[1] === 'null')
      throw new HttpException('access token expired', HttpStatus.UNAUTHORIZED);

    return super.canActivate(context);
  }

  // You can throw an exception based on either "info" or "err" arguments
  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err ||
        new HttpException('access token is not found', HttpStatus.UNAUTHORIZED)
      );
    }
    return user;
  }
}
