import { Body, Param, Query } from '@nestjs/common';
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
import { IParams } from 'src/shared/interface/params.interface';
import { RateWarehouseDto } from '../dto/rate-warehouse.dto';

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

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.PHARMACY],
  })
  findWarehouse(@Param() params: IParams) {
    return this.pharmacyWarehouseService.findOne(+params.id);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'rate-warehouse',
    role: [Role.PHARMACY],
  })
  rateWarehouse(@Body() body: RateWarehouseDto) {
    return this.pharmacyWarehouseService.rateWarehouse(body);
  }
}
