import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { errorsCode } from 'src/shared/Types/errorsCode';

@Injectable()
export class UserError {
  notFoundUserError = {
    message: 'user not found',
    code: errorsCode.notFoundUser,
  };

  notFoundUser() {
    throw new HttpException(this.notFoundUserError, HttpStatus.NOT_FOUND);
  }
}
