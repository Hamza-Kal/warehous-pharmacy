import { Body } from '@nestjs/common';
import { WarehouseAuthService } from 'src/auth/services/warehouse.auth.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CreateWarehouseDto } from 'src/warehouse/api/dto/create-warehouse.dto';

@AuthenticatedController({
  controller: 'auth',
})
export class WarehouseAuthController {
  constructor(private warehouseAuthService: WarehouseAuthService) {}

  @AuthorizedApi({
    api: Api.POST,
    role: [Role.GUEST],
    url: '/complete-info',
    completedAccount: false,
  })
  completeWarehouseInfo(@Body() body: CreateWarehouseDto) {
    return this.warehouseAuthService.createWarehouse(body);
  }
}
