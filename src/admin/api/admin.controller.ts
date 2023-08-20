import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AdminService } from '../service/admin.service';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { Param, Query } from '@nestjs/common';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IParams } from 'src/shared/interface/params.interface';
import { AdminQueryDto } from './dto/querty-dtos/admin.query.dto';

@AuthenticatedController({
  controller: '/admin',
})
export class AdminController {
  constructor(private adminService: AdminService) {}

  @AuthorizedApi({
    url: '/suppliers',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findAllSuppliers(@Query() query: AdminQueryDto) {
    const parsingResult = paginationParser(query);
    return this.adminService.findAllSuppliers(parsingResult);
  }

  @AuthorizedApi({
    url: '/warehouses',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findAllWarehouses(@Query() query: AdminQueryDto) {
    const parsingResult = paginationParser(query);
    return this.adminService.findAllWarehousehouses(parsingResult);
  }

  @AuthorizedApi({
    url: '/inventories',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findAllinventories(@Query() query: AdminQueryDto) {
    const parsingResult = paginationParser(query);
    return this.adminService.findAllInventories(parsingResult);
  }

  @AuthorizedApi({
    url: '/pharmacies',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findAllPharmacies(@Query() query: AdminQueryDto) {
    const parsingResult = paginationParser(query);
    return this.adminService.findAllPharmacies(parsingResult);
  }

  @AuthorizedApi({
    url: '/suppliers/:id',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findSupplier(@Param() param: IParams) {
    return this.adminService.findOneSupplier(+param.id);
  }

  @AuthorizedApi({
    url: '/warehouses/:id',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findWarehouse(@Param() param: IParams) {
    return this.adminService.findOneWarehouse(+param.id);
  }

  @AuthorizedApi({
    url: '/inventories/:id',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findInventory(@Param() param: IParams) {
    return this.adminService.findOneInventory(+param.id);
  }

  @AuthorizedApi({
    url: '/pharmacies/:id',
    api: Api.GET,
    role: [Role.ADMIN],
  })
  async findPharamacy(@Param() param: IParams) {
    return this.adminService.findOnePharmacy(+param.id);
  }
}
