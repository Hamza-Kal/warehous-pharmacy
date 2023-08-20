import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { SupplierWarehouseService } from 'src/supplier/service/supplier-warehouse.service';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { Param, Body } from '@nestjs/common';
import { RateWarehouseDto } from 'src/warehouse/api/dto/rate-warehouse.dto';
import { RateSupplierDto } from '../dto/rate-supplier.dto';
import { IParams } from 'src/shared/interface/params.interface';

@AuthenticatedController({
  controller: 'supplier/warehouse',
})
export class SupplierWarehouseController {
  constructor(private supplierWarehouseService: SupplierWarehouseService) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'rate-supplier',
    role: [Role.WAREHOUSE],
  })
  rateWarehouse(@Body() body: RateSupplierDto) {
    return this.supplierWarehouseService.rateWarehouse(body);
  }
}
