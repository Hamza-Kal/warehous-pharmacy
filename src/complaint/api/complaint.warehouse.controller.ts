import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { ComplaintWarehouseService } from '../services/complaint.warehouse.service';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { Body } from '@nestjs/common';
import {
  WarehouseComplaintPharmacyDto,
  WarehouseComplaintSupplierDto,
} from './dtos/warehouse-complaint.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@AuthenticatedController({
  controller: 'complaint/warehouse',
})
export class ComplaintWarehouseController {
  constructor(private complaintWarehouseService: ComplaintWarehouseService) {}

  @AuthorizedApi({
    api: Api.POST,
    url: 'supplier',
    role: [Role.WAREHOUSE],
  })
  async complaintSupplier(
    @Body() body: WarehouseComplaintSupplierDto,
    @CurrUser() user: IUser,
  ) {
    return this.complaintWarehouseService.complaintSupplier(body, user);
  }

  @AuthorizedApi({
    api: Api.POST,
    url: 'pharmacy',
    role: [Role.WAREHOUSE],
  })
  async complaintPharmacy(
    @Body() body: WarehouseComplaintPharmacyDto,
    @CurrUser() user: IUser,
  ) {
    return this.complaintWarehouseService.complaintPharmacy(body, user);
  }
}
