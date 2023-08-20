import { Body, Param } from '@nestjs/common';
import { PharmacyWebService } from 'src/pharmacy/services/pharmacy-web.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CreatePharmacyDto } from '../dtos/create-pharmacy.dto';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { IParams } from 'src/shared/interface/params.interface';
import { PharmacyService } from 'src/pharmacy/services/pharmacy.service';

@AuthenticatedController({
  controller: 'pharmacy',
})
export class PharmacyController {
  constructor(
    private pharmacyWebService: PharmacyWebService,
    private pharmacyService: PharmacyService,
  ) {}

  // TODO handle the user assigned role must be pharmacy
  @AuthorizedApi({
    api: Api.POST,
    url: '/complete-info',
    role: [Role.GUEST],
    completedAccount: [false],
  })
  async completeInfo(@Body() body: CreatePharmacyDto, @CurrUser() user: IUser) {
    return this.pharmacyWebService.createPharmacy(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'profile',
    role: [Role.PHARMACY],
  })
  async getPharmacy(@CurrUser() user: IUser) {
    return await this.pharmacyService.findOne(user);
  }
}
