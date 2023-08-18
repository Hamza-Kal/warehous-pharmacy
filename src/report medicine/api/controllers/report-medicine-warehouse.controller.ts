import { Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { IParams } from 'src/shared/interface/params.interface';
import { WarehouseReportMedicineService } from 'src/report medicine/services/report-medicine-warehouse.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';

@AuthenticatedController({
  controller: '/report-medicine/warehouse',
})
export class ReportMedicineWarehouseController {
  constructor(private reportMedicineService: WarehouseReportMedicineService) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'accept/:id',
    role: [Role.WAREHOUSE],
  })
  async acceptReportMedicine(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.reportMedicineService.acceptReportOrder(
      { id: +param.id },
      user,
    );
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'accept-pharmacy/:id',
    role: [Role.WAREHOUSE],
  })
  async acceptPharmacyReportMedicine(
    @Param() param: IParams,
    @CurrUser() user: IUser,
  ) {
    return this.reportMedicineService.acceptPharmacyReportOrder(
      { id: +param.id },
      user,
    );
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'reject-pharmacy/:id',
    role: [Role.WAREHOUSE],
  })
  async rejectPharmacyReportMedicine(
    @Param() param: IParams,
    @CurrUser() user: IUser,
  ) {
    return this.reportMedicineService.rejectPharmacyReportOrder(
      { id: +param.id },
      user,
    );
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: 'reject/:id',
    role: [Role.WAREHOUSE],
  })
  async rejectReportMedicine(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.reportMedicineService.rejectReportOrder(
      { id: +param.id },
      user,
    );
  }
  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async findAll(@Query() query: Pagination, @CurrUser() user: IUser) {
    const { criteria, pagination } = paginationParser(query);
    return this.reportMedicineService.findAll({ pagination, criteria }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'pharmacy',
    role: [Role.WAREHOUSE],
  })
  async findAllPharmacy(@Query() query: Pagination, @CurrUser() user: IUser) {
    const { criteria, pagination } = paginationParser(query);
    return this.reportMedicineService.findAllPharmacy(
      { pagination, criteria },
      user,
    );
  }
}
