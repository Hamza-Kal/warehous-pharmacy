import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';
import { Role } from 'src/shared/enums/roles';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { IParams } from 'src/shared/interface/params.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'user',
})
export class UserDashboardController {
  constructor(private userService: UserService) {}
  @AuthorizedApi({
    api: Api.PATCH,
    role: [Role.PHARMACY],
    url: '',
  })
  async acceptAccount(@Param() params: IParams) {
    return this.userService.acceptAccount(params);
  }

  // need pagination
  @AuthorizedApi({
    api: Api.GET,
    url: 'guests',
    role: [Role.ADMIN],
  })
  async getAllGuests() {
    return this.userService.getAllGuests();
  }
}
