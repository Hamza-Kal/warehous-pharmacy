import { Body, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CreateMedicine } from '../dto/create-medicine.dto';
import { Pagination } from '../../../shared/pagination/pagination.validation';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IUser } from 'src/shared/interface/user.interface';
import { CreateMedicineBrew } from '../dto/create-medicine-brew.dto';
import { MedicineSupplierService } from 'src/medicine/services/medicine-supplier.service';

@AuthenticatedController({
  controller: '/supplier/medicine',
})
export class MedicineController {
  constructor(private medicineService: MedicineSupplierService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.SUPPLIER],
  })
  async create(@Body() body: CreateMedicine, @CurrUser() user) {
    return await this.medicineService.create(user, body);
  }

  @AuthorizedApi({
    url: 'create-brew',
    api: Api.POST,
    role: [Role.SUPPLIER],
  })
  async createBrew(@Body() body: CreateMedicineBrew, @CurrUser() user: IUser) {
    return await this.medicineService.createMeicineBrew(user, body);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Role.SUPPLIER],
  })
  async getSupplierMedicines(
    @Query() query: Pagination,
    @CurrUser() user: IUser,
  ) {
    const parsingResult = paginationParser(query);
    return this.medicineService.findAll(parsingResult, user);
  }
}
