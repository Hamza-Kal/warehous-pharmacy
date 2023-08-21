import { Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { FindAllWarehousesQueryDto } from '../dto/query/find-all-warehouses.dto';
import { WarehouseSupplierService } from 'src/warehouse/services/warehouse-supplier.service';
import { paginationParser } from 'src/shared/pagination/pagination';

@AuthenticatedController({
  controller: 'warehouse/supplier',
})
export class WarehouseSupplierController {
  constructor(private warehouseSupplierService: WarehouseSupplierService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: 'get-warehouses',
    role: [Role.SUPPLIER],
  })
  getWarehouses(@Query() query: FindAllWarehousesQueryDto) {
    const parsingResult = paginationParser(query);
    return this.warehouseSupplierService.getWarehouses(parsingResult);
  }
}
