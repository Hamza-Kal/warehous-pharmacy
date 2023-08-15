import { Body, Param } from '@nestjs/common';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { WarehouseWebService } from '../../services/warehouse-web.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from '../../../shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { IParams } from 'src/shared/interface/params.interface';
import { UpdateWareHouseDto } from '../dto/update-warehouse.dto';

@AuthenticatedController({
  controller: 'warehouse',
})
export class WarehouseController {
  constructor(
    private warehouseWebService: WarehouseWebService,
    private warehouseService: WarehouseService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/create-warehouse',
    role: [Role.GUEST],
    completedAccount: false,
  })
  async completeInfo(
    @Body() body: CreateWarehouseDto,
    @CurrUser() user: IUser,
  ) {
    return this.warehouseWebService.createWarehouse(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'get-info/:id',
    role: [Role.WAREHOUSE],
  })
  async getWarehouseInfo(@CurrUser() user: IUser, @Param() params: IParams) {
    return this.warehouseService.getWarehouseInfo(+params.id, user);
  }
  @AuthorizedApi({
    api: Api.PATCH,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async update(@Body() body: UpdateWareHouseDto, @CurrUser() user: IUser) {
    return this.warehouseWebService.update(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    role: [Role.WAREHOUSE],
    url: '/inventories',
  })
  async getAllInventories(@CurrUser() user: IUser) {
    return await this.warehouseService.getAllInventories(user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/get-suppliers',
    role: [Role.WAREHOUSE],
  })
  async getSuppliers() {
    //@Query() query: Pagination
    // const parsingResult = paginationParser(query);
    return this.warehouseWebService.getAllSuppliers(); //parsingResult
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/get-suppliers/:id',
    role: [Role.WAREHOUSE],
  })
  getOneSupplier(@Param() param: IParams) {
    //@Query() query: Pagination
    // const parsingResult = paginationParser(query);
    return this.warehouseWebService.getSupplierById(+param.id); //parsingResult
  }
}
