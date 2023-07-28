import { Body } from '@nestjs/common';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { CreateMedicine } from '../dto/create-medicine.dto';
import { MedicineWebService } from 'src/medicine/services/medicine.service';

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
  async create(@Body() body: CreateMedicine) {
    return await this.medicineService.create(body);
  }
}
