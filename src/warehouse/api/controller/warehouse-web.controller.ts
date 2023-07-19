import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWareHouseDto } from '../dto/update-warehouse.dto';
import { WarehouseWebService } from '../../services/warehouse-web.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { User } from 'src/user/entities/user.entity';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { ApiMethods } from 'src/shared/decorators/get-api-methods/get.api.methods';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { DataSource } from 'typeorm';
@AuthenticatedController({
  controller: 'warehouse',
})
export class WarehouseController {
  constructor(private warehouseWebService: WarehouseWebService) {}

  // @AuthorizedApi({
  //   api: Api.GET,
  //   role: [Role.WAREHOUSE],
  //   url: '/inventories',
  // })
  // async getAllInventories(@CurrUser() user) {
  //   return await this.warehouseWebService.
  // }
}
