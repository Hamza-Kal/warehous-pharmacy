import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseOrderService } from 'src/order/services/order-warehouse.service';
import {
  CreatePharmacyOrderDto,
  CreateWarehouseOrderDto,
} from '../dto/create-warehouse-order.dto';
import { query } from 'express';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IParams } from 'src/shared/interface/params.interface';
import { PharmacyOrderService } from 'src/order/services/order-pharmacy.service';
import { GetOrder } from '../dto/get-order-request-by-criteria.dto';

@AuthenticatedController({
  controller: '/order/pharmacy',
})
export class OrderPharmacyController {
  constructor(private orderService: PharmacyOrderService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.PHARMACY],
  })
  async create(@Body() body: CreatePharmacyOrderDto, @CurrUser() user: IUser) {
    return await this.orderService.create(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/details/:id',
    role: [Role.PHARMACY],
  })
  async findDetails(@Param() param: IParams, @CurrUser() user: IUser) {
    return await this.orderService.findDetails({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.PHARMACY],
  })
  async findOne(@Param() param: IParams, @CurrUser() user: IUser) {
    return await this.orderService.findOne({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.PHARMACY],
  })
  async findAll(@Query() query: GetOrder, @CurrUser() user: IUser) {
    const { pagination, criteria } = paginationParser(query);
    return await this.orderService.findAll({ pagination, criteria }, user);
  }
}
