import { Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';
import { IUser } from 'src/shared/interface/user.interface';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { MedicineInventoryService } from 'src/medicine/services/medicine-inventory.service';

@AuthenticatedController({
  controller: 'medicine/inventory',
})
export class MedicineInventoryController {
  constructor(private inventoryMedicineService: MedicineInventoryService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.INVENTORY],
  })
  async findAll(@Query() query: Pagination, @CurrUser() user: IUser) {
    const { pagination, criteria } = paginationParser(query);
    return await this.inventoryMedicineService.findAll(
      { pagination, criteria },
      user,
    );
  }
  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.INVENTORY],
  })
  async findOne(@Param() param: IParams, @CurrUser() user: IUser) {
    return await this.inventoryMedicineService.findOne({ id: +param.id }, user);
  }
}
