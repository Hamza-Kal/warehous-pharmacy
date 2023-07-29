import { Body, Query } from '@nestjs/common';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWareHouseDto } from '../dto/update-warehouse.dto';
import { WarehouseWebService } from '../../services/warehouse-web.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { User } from 'src/user/entities/user.entity';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { ApiMethods } from 'src/shared/decorators/get-api-methods/get.api.methods';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from '../../../shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';
@AuthenticatedController({
  controller: 'warehouse',
})
export class WarehouseController {
  constructor(
    private warehouseWebService: WarehouseWebService,
    private warehouseService: WarehouseService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    role: [Role.WAREHOUSE],
    url: '/inventories',
  })
  async getAllInventories(@CurrUser() user: IUser) {
    return await this.warehouseService.getAllInventories(user);
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '/create-warehouse',
    role: [Role.GUEST],
    completedAccount: false,
  })
  async completeInfo(@Body() body: CreateWarehouseDto, @CurrUser() user: IUser) {
    return this.warehouseWebService.createWarehouse(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/get-suppliers',
    role: [Role.WAREHOUSE],
  })
  getSuppliers(@Query() query: Pagination) {
    const parsingResult = paginationParser(query);
    return this.warehouseWebService.getAllSuppliers(parsingResult);
  }
}
