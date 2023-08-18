import { Body, Param, Query } from '@nestjs/common';
import { PharmacyOrderService } from 'src/order/services/order-pharmacy.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateReportMedicine } from '../dto/create-return-order.dto';
import { PharmacyReportMedicineService } from 'src/report medicine/services/report-medicine-pharmacy.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';

@AuthenticatedController({
  controller: '/report-order/pharmacy',
})
export class PharmacyReportMedicineController {
  constructor(
    private readonly pharmacyReportMedicineService: PharmacyReportMedicineService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    role: [Role.PHARMACY],
    url: '/:id',
  })
  async createReturnOrder(
    @Param() param: IParams,
    @Body() body: CreateReportMedicine,
    @CurrUser() user: IUser,
  ) {
    return await this.pharmacyReportMedicineService.create(body, user, {
      id: +param.id,
    });
  }

  @AuthorizedApi({
    api: Api.GET,
    role: [Role.PHARMACY],
    url: '/',
  })
  async findAll(@CurrUser() user: IUser, @Query() query: Pagination) {
    const { pagination, criteria } = paginationParser(query);
    return await this.pharmacyReportMedicineService.findAll(
      { pagination, criteria },
      user,
    );
  }
}
