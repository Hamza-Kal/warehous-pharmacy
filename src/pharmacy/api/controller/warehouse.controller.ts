import { Query } from '@nestjs/common';
import { PharmacyWarehouseService } from 'src/pharmacy/services/warehouse.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';

@AuthenticatedController({
  controller: 'pharmacy/warehouse',
})
export class PharmacyWarehouseController {
  constructor(private pharmacyWarehouseService: PharmacyWarehouseService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async getAllPharmacies(@Query() query: Pagination) {
    const parsingResult = paginationParser(query);
    return this.pharmacyWarehouseService.findAllPharmacies(parsingResult);
  }
}
