import { Body, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Role } from 'src/shared/enums/roles';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { IParams } from 'src/shared/interface/params.interface';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';

@AuthenticatedController({
  controller: 'user',
})
export class UserDashboardController {
  constructor(private userService: UserService) {}
  @AuthorizedApi({
    api: Api.PATCH,
    role: [Role.ADMIN],
    url: 'accept/:id',
  })
  async acceptAccount(@Param() params: IParams) {
    return this.userService.acceptAccount({ id: +params.id });
  }
  @AuthorizedApi({
    api: Api.PATCH,
    role: [Role.ADMIN],
    url: 'reject/:id',
  })
  async rejectAccount(@Param() params: IParams) {
    return this.userService.rejectAccount({ id: +params.id });
  }

  @AuthorizedApi({
    api: Api.POST,
    created: false,
    role: [
      Role.GUEST,
      Role.WAREHOUSE,
      Role.INVENTORY,
      Role.SUPPLIER,
      Role.PHARMACY,
    ],
    url: 'is-accepted',
    completedAccount: [true, false],
  })
  async isAccepted(@CurrUser() user: IUser) {
    return this.userService.isAccepted(user);
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

  @AuthorizedApi({
    api: Api.GET,
    url: 'active',
    role: [Role.ADMIN],
  })
  async getAllUsers() {
    return this.userService.findActive();
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'ban/:id',
    role: [Role.ADMIN],
  })
  async getBannedUsers(@Param() params: IParams) {
    return this.userService.banUser(+params.id);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'recover/:id',
    role: [Role.ADMIN],
  })
  async recoverUser(@Param() params: IParams) {
    return this.userService.recoverUser(+params.id);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'banned',
    role: [Role.ADMIN],
  })
  async getBanned() {
    return this.userService.getBannedUsers();
  }
  @AuthorizedApi({
    api: Api.PATCH,
    url: 'edit-profile',
    role: [
      Role.GUEST,
      Role.SUPPLIER,
      Role.WAREHOUSE,
      Role.INVENTORY,
      Role.PHARMACY,
    ],
  })
  async editProfile(@Body() body: UpdateUserDto, @CurrUser() user: IUser) {
    return this.userService.editUser(body, user);
  }
}
