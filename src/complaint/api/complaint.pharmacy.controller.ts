import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { ComplaintPharmacyService } from '../services/complaint.pharmacy.service';
import { Body } from '@nestjs/common';
import { PharmacyComplainWarehousetDto } from './dtos/pharmacy-complaint-warehouse.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';

@AuthenticatedController({
  controller: 'complaint/pharmacy',
})
export class ComplaintPharmacyController {
  constructor(private complaintPharmacyService: ComplaintPharmacyService) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.PHARMACY],
  })
  async complaintWarehouse(
    @Body() body: PharmacyComplainWarehousetDto,
    @CurrUser() user: IUser,
  ) {
    return this.complaintPharmacyService.complaintWarehouse(body, user);
  }
}
