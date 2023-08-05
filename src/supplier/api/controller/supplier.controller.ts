import { Body, Controller, Query, Param } from '@nestjs/common';
import { CreatePharmacyDto } from 'src/pharmacy/api/dtos/create-pharmacy.dto';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierDashboardService } from 'src/supplier/service/supplier-dashboard.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { IParams } from 'src/shared/interface/params.interface';
@AuthenticatedController({
  controller: 'supplier',
})
export class SupplierController {
  constructor(
    private supplierDashboardService: SupplierDashboardService,
    private supplierService: SupplierService,
  ) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '/complete-info',
    role: [Role.GUEST],
    completedAccount: false,
  })
  async completeInfo(@Body() body: CreateSupplierDto, @CurrUser() user: IUser) {
    return this.supplierDashboardService.createSupplier(user, body);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/get-brews/:id',
    role: [Role.SUPPLIER],
  })
  async getBrews(@Param() params: IParams, @CurrUser() user: IUser) {
    return this.supplierService.getBrews(+params.id, user);
  }
}
