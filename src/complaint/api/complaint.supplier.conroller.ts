import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { ComplaintSupplierService } from '../services/complaint.supplier.service';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { Body } from '@nestjs/common';
import { SupplierComplaintWarehouseDto } from './dtos/supplier-complaint.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@AuthenticatedController({
  controller: 'complaint/supplier',
})
export class ComplaintSupplierController {
  constructor(private complaintSupplierService: ComplaintSupplierService) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.SUPPLIER],
  })
  async complaintWarehouse(
    @Body() body: SupplierComplaintWarehouseDto,
    @CurrUser() user: IUser,
  ) {
    return this.complaintSupplierService.complaintWarehouse(body, user);
  }
}
