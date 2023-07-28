import { Body, Controller, Query } from '@nestjs/common';
import { CreatePharmacyDto } from 'src/pharmacy/api/dtos/create-pharmacy.dto';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierDashboardService } from 'src/supplier/service/supplier-dashboard.service';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierDashboardService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '/complete-info',
    role: [Role.SUPPLIER],
    completedAccount: false,
  })
  async completeInfo(@Body() body: CreatePharmacyDto, @CurrUser() user: IUser) {
    return this.supplierService.createSupplier(user, body);
  }
}
