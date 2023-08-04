import { Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseOrderService } from 'src/order/services/order-warehouse.service';
import { CreateWarehouseOrderDto } from '../dto/create-warehouse-order.dto';
import { SupplierOrderService } from 'src/order/services/order-supplier.service';
import { IParams } from 'src/shared/interface/params.interface';

@AuthenticatedController({
  controller: '/order/supplier',
})
export class OrderSupplierController {
  constructor(private orderService: SupplierOrderService) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'accept/:id',
    role: [Role.SUPPLIER],
  })
  async acceptOrder(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.orderService.acceptOrder({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'deliver/:id',
    role: [Role.SUPPLIER],
  })
  async deliverOrder(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.orderService.deliveredOrder({ id: +param.id }, user);
  }
}
