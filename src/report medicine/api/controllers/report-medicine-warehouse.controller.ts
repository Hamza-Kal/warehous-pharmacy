import { Param } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { IParams } from 'src/shared/interface/params.interface';
import { WarehouseReportMedicineService } from 'src/report medicine/services/report-medicine-warehouse.service';

@AuthenticatedController({
  controller: '/reportMedicine/supplier',
})
export class ReportMedicineWarehouesController {
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
    url: 'reject/:id',
    role: [Role.WAREHOUSE],
  })
  async rejectReportMedicine(@Param() param: IParams, @CurrUser() user: IUser) {
    return this.reportMedicineService.rejectReportOrder(
      { id: +param.id },
      user,
    );
  }
}
