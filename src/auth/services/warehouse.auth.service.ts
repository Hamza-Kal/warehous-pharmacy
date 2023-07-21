import { Injectable } from '@nestjs/common';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { RegisterDto } from '../api/dto';

@Injectable()
export class WarehouseAuthService {
  constructor(private userService: UserService) {}

  // async register(user: IUser, body: RegisterDto) {
  //   return await this.userService.createOne()
  // }
}
