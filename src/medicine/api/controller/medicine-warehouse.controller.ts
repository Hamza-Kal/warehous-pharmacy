import { Param, Query } from '@nestjs/common';
import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';

@AuthenticatedController({
  controller: 'medicine/warehouse',
})
export class MedicineWarehouseController {
  constructor(private warehouseMedicineService: WarehouseMedicineService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/supplier/:id',
    role: [Role.WAREHOUSE],
  })
  async findAll(@Param() param: IParams, @Query() query: Pagination) {
    const { criteria, pagination } = paginationParser(query);
    return this.warehouseMedicineService.findAll(
      { criteria, pagination },
      +param.id,
    );
  }
}
