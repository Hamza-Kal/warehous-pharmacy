import { Body } from '@nestjs/common';
import { InventoryAuthService } from 'src/auth/services/inventory.auth.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { InventroyRegister } from '../dto/register.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { CurrUser } from 'src/shared/decorators/user.decorator';

@AuthenticatedController({
  controller: 'auth',
})
export class WarehouseAuthController {
  constructor(private inventoryAuthService: InventoryAuthService) {}

  @AuthorizedApi({
    url: 'inventory-register',
    api: Api.POST,
    role: [Role.WAREHOUSE],
  })
  async registerInventory(
    @Body() body: InventroyRegister,
    @CurrUser() user: IUser,
  ) {
    body.assignedRole = Role.INVENTORY;
    return await this.inventoryAuthService.register(body, user);
  }
}
