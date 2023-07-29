import { Body, Controller, Query } from '@nestjs/common';
import { CreatePharmacyDto } from 'src/pharmacy/api/dtos/create-pharmacy.dto';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierDashboardService } from 'src/supplier/service/supplier-dashboard.service';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

@AuthenticatedController({
  controller: 'supplier',
})
export class SupplierController {
  constructor(private supplierService: SupplierDashboardService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '/complete-info',
    role: [Role.GUEST],
    completedAccount: false,
  })
  async completeInfo(@Body() body: CreateSupplierDto, @CurrUser() user: IUser) {
    return this.supplierService.createSupplier(user, body);
  }
}
