import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseOrderService } from 'src/order/services/order-warehouse.service';
import { CreateWarehouseOrderDto } from '../dto/create-warehouse-order.dto';

@AuthenticatedController({
  controller: '/order/warehouse',
})
export class OrderWarehouesController {
  constructor(private orderService: WarehouseOrderService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async create(@Body() body: CreateWarehouseOrderDto, @CurrUser() user: IUser) {
    return await this.orderService.create(body, user);
  }
}
