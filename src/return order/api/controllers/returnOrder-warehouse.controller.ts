import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateWarehouseReturnOrderDto } from '../dto/create-warehouse-returnOrder.dto';
import { query } from 'express';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IParams } from 'src/shared/interface/params.interface';
import { WarehouseReturnOrderService } from 'src/return order/services/returnOrder-warehouse.service';
import { FindAllReturnOrdersQueryDto } from '../dto/query/find-all-returnOrders.query.dto';

@AuthenticatedController({
  controller: '/returnOrder/warehouse',
})
export class ReturnOrderWarehouseController {
  constructor(private returnOrderService: WarehouseReturnOrderService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async create(
    @Body() body: CreateWarehouseReturnOrderDto,
    @CurrUser() user: IUser,
  ) {
    return await this.returnOrderService.create(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.WAREHOUSE],
  })
  async findOne(@Param() param: IParams, @CurrUser() user: IUser) {
    return await this.returnOrderService.findOne({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async findAll(
    @Query() query: FindAllReturnOrdersQueryDto,
    @CurrUser() user: IUser,
  ) {
    const { pagination, criteria } = paginationParser(query);
    return await this.returnOrderService.findAll(
      { pagination, criteria },
      user,
    );
  }
}
