import { Body, Param, Query } from '@nestjs/common';
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
import { IParams } from 'src/shared/interface/params.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';

@AuthenticatedController({
  controller: '/category',
})
export class CategoryController {
  constructor(private medicineService: MedicineService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Role.SUPPLIER, Role.INVENTORY, Role.WAREHOUSE, Role.PHARMACY],
  })
  async getOne() {
    return this.medicineService.findAllCategories();
  }
}
