import { Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { WarehousePharmacyService } from 'src/warehouse/services/warehouse-pharmacy.service';
import { FindAllForPharmacyDto } from '../dto/query/find-all-for-pharmacies.dto';

@AuthenticatedController({
  controller: 'warehouse/pharmacy',
})
export class PharmacyWarehouseController {
  constructor(private pharmacyWarehouseService: WarehousePharmacyService) {}

  @AuthorizedApi({
    api: Api.GET,
    role: [Role.PHARMACY],
    url: '',
  })
  async findAll(
    @Query() query: FindAllForPharmacyDto,
    @CurrUser() user: IUser,
  ) {
    const parsingResult = paginationParser(query);
    return await this.pharmacyWarehouseService.findAll(parsingResult);
  }
}
