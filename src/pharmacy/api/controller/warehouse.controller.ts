import { Param } from '@nestjs/common';
import { PharmacyWarehouseService } from 'src/pharmacy/services/pharmacy.warehouse.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';

@AuthenticatedController({
  controller: 'pharmacy/warehouse',
})
export class WarehousePharmacyController {
  constructor(private pharmacyWarehouseService: PharmacyWarehouseService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.PHARMACY],
  })
  findWarehouse(@Param() params: IParams) {
    return this.pharmacyWarehouseService.findOne(+params.id);
  }
}
