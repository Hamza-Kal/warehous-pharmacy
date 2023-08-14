import { Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Role } from 'src/shared/enums/roles';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { IParams } from 'src/shared/interface/params.interface';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

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
    api: Api.POST,
    created: false,
    role: [Role.WAREHOUSE, Role.INVENTORY, Role.SUPPLIER, Role.PHARMACY],
    url: 'is-accepted',
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
}
