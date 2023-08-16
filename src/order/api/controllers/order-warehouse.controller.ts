import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseOrderService } from 'src/order/services/order-warehouse.service';
import { CreateWarehouseOrderDto } from '../dto/create-warehouse-order.dto';
import { query } from 'express';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IParams } from 'src/shared/interface/params.interface';

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

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/accept/:id',
    role: [Role.WAREHOUSE],
  })
  async accept(@CurrUser() user: IUser, @Param() param: IParams) {
    return await this.orderService.acceptOrder({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/deliver/:id',
    role: [Role.WAREHOUSE],
  })
  async deliver(@CurrUser() user: IUser, @Param() param: IParams) {
    return await this.orderService.deliveredOrder({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.WAREHOUSE],
  })
  async findOne(@Param() param: IParams, @CurrUser() user: IUser) {
    return await this.orderService.findOne({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async findAll(@Query() query: Pagination, @CurrUser() user: IUser) {
    const { pagination, criteria } = paginationParser(query);
    return await this.orderService.findAll({ pagination, criteria }, user);
  }
}
