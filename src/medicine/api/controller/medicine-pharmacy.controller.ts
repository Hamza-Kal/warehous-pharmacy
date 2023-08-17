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
import { UpdateMedicineDto } from '../dto/update-medicine.dto';
import { PharmacyMedicineService } from 'src/medicine/services/medicine-pharmacy.service';

@AuthenticatedController({
  controller: '/medicine/pharmacy',
})
export class MedicinePharmacyController {
  constructor(private medicineService: PharmacyMedicineService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/warehouse/:id',
    role: [Role.PHARMACY],
  })
  async findAllWarehouse(
    @Query() query: Pagination,

    @Param() param: IParams,
  ) {
    const { pagination, criteria } = paginationParser(query);
    return await this.medicineService.findAllWarehouse(
      { pagination, criteria },
      +param.id,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/warehouse/medicine/:id',
    role: [Role.PHARMACY],
  })
  async findOneWarehouse(@Param() param: IParams) {
    return await this.medicineService.findOneWarehouse(+param.id);
  }
}
