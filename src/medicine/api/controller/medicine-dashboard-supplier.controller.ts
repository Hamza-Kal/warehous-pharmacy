import { Body, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CreateMedicine } from '../dto/create-medicine.dto';
import { MedicineWebService } from 'src/medicine/services/medicine.service';
import { Pagination } from '../../../shared/pagination/pagination.validation';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateMedicineBrew } from '../dto/create-medicine-brew.dto';

@AuthenticatedController({
  controller: 'medicine',
})
export class MedicineController {
  constructor(private medicineService: MedicineWebService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.SUPPLIER],
  })
  async create(@Body() body: CreateMedicine, @CurrUser() user) {
    return await this.medicineService.create(user, body);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/get-medicine-supplier',
    role: [Role.SUPPLIER],
  })
  async getSupplierMedicines(
    @Query() query: Pagination,
    @CurrUser() user: IUser,
  ) {
    const parsingResult = paginationParser(query);
    return this.medicineService.getSupplierMedicines(parsingResult, user);
  }

  @AuthorizedApi({
    url: 'create-brew',
    api: Api.POST,
    role: [Role.SUPPLIER],
  })
  async createBrew(@Body() body: CreateMedicineBrew, @CurrUser() user: IUser) {
    return await this.medicineService.createMeicineBrew(user, body);
  }
}
