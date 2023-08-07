import { Param } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { IParams } from 'src/shared/interface/params.interface';
import { SupplierReturnOrderService } from 'src/return order/services/returnOrder-supplier.service';

@AuthenticatedController({
  controller: '/returnOrder/supplier',
})
export class ReturnOrderSupplierController {
  constructor(private returnOrderService: SupplierReturnOrderService) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'accept/:id',
    role: [Role.SUPPLIER],
  })
  async acceptReturnOrder(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.returnOrderService.acceptReturnOrder({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'reject/:id',
    role: [Role.SUPPLIER],
  })
  async rejectReturnOrder(@Param() param: IParams, @CurrUser() user: IUser) {
    // return this.returnOrderService.rejectReturnOrder({ id: +param.id }, user);
  }
}
