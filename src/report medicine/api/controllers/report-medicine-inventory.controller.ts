import { Body, Param, Query } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CurrUser } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
import { query } from 'express';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { paginationParser } from 'src/shared/pagination/pagination';
import { IParams } from 'src/shared/interface/params.interface';
import { InventoryReportMedicineService } from 'src/report medicine/services/report-medicine-inventory.service';
import { CreateReportMedicineDto } from '../dto/create-warehouse-report-medicine.dto';

@AuthenticatedController({
  controller: '/reportMedicine/warehouse',
})
export class ReportMedicineInventoryController {
  constructor(private reportMedicineService: InventoryReportMedicineService) {}
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Role.INVENTORY],
  })
  async create(@Body() body: CreateReportMedicineDto, @CurrUser() user: IUser) {
    return await this.reportMedicineService.creategi(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Role.INVENTORY],
  })
  async findOne(@Param() param: IParams, @CurrUser() user: IUser) {
    // return await this.reportMedicineService.findOne({ id: +param.id }, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Role.INVENTORY],
  })
  async findAll(@Query() query: Pagination, @CurrUser() user: IUser) {
    const { pagination, criteria } = paginationParser(query);
    return await this.reportMedicineService.findAll(
      { pagination, criteria },
      user,
    );
  }
}
