import { Body, Param, Query } from '@nestjs/common';
import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { IParams } from 'src/shared/interface/params.interface';
import { IUser } from 'src/shared/interface/user.interface';
import { paginationParser } from 'src/shared/pagination/pagination';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { UpdatePriceDto } from '../dto/warehouseDto/update-medicine-price.dto';
import { TransferToInventoryDto } from 'src/warehouse/api/dto/transfer-to-inventory';

@AuthenticatedController({
  controller: 'medicine/warehouse',
})
export class MedicineWarehouseController {
  constructor(private warehouseMedicineService: WarehouseMedicineService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/supplier/:id',
    role: [Role.WAREHOUSE],
  })
  async findAllSuppliers(@Param() param: IParams, @Query() query: Pagination) {
    const { criteria, pagination } = paginationParser(query);
    return this.warehouseMedicineService.findAllSuppliers(
      { criteria, pagination },
      +param.id,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/supplier/medicine/:id',
    role: [Role.WAREHOUSE],
  })
  async findOne(@Param() param: IParams) {
    return this.warehouseMedicineService.findOneSupplierMedicine(+param.id);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.WAREHOUSE],
  })
  async findAll(@CurrUser() user: IUser, @Query() query: Pagination) {
    const { criteria, pagination } = paginationParser(query);
    return await this.warehouseMedicineService.findAll(
      { criteria, pagination },
      user,
    );
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/transfer-to-intentory',
    role: [Role.WAREHOUSE],
  })
  transterToInventory(
    @Body() body: TransferToInventoryDto,
    @CurrUser() user: IUser,
  ) {
    return this.warehouseMedicineService.transferToInventory(body, user);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Role.WAREHOUSE],
  })
  async updatePrice(
    @CurrUser() user: IUser,
    @Body() body: UpdatePriceDto,
    @Param() param: IParams,
  ) {
    return await this.warehouseMedicineService.update(+param.id, body, user);
  }
}
