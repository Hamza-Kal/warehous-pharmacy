import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';
import { ComplaintAdminService } from '../services/complaint.admin.service';
import { AuthorizedApi } from 'src/shared/decorators/authorization.decorator';
import { Api } from 'src/shared/enums/API';
import { Role } from 'src/shared/enums/roles';
import { Body, Param } from '@nestjs/common';
import { IParams } from 'src/shared/interface/params.interface';
import { DeleteComplaintDto } from './dtos/delete-complaint.dto';

@AuthenticatedController({
  controller: 'complaint/admin',
})
export class ComplaintAdminController {
  constructor(private complaintAdminService: ComplaintAdminService) {}

  @AuthorizedApi({
    api: Api.GET,
    url: 'suppliers',
    role: [Role.ADMIN],
  })
  async getSuppliersComplaints() {
    return this.complaintAdminService.getAllSuppliersComplaints();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'warehouses/suppliers',
    role: [Role.ADMIN],
  })
  async getWarehousesSuppliersComplaints() {
    return this.complaintAdminService.getAllWarehouseSupplierComplaints();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'warehouses/pharmacies',
    role: [Role.ADMIN],
  })
  async getWarehousesPharmaciesComplaints() {
    return this.complaintAdminService.getAllWarehousePharmacyComplaints();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: 'pharmacies',
    role: [Role.ADMIN],
  })
  async getPharmaciesComplaints() {
    return this.complaintAdminService.getAllPharmaciesComplaints();
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: 'delete-complaint/:id',
    role: [Role.ADMIN],
  })
  async deleteComplaint(
    @Param() params: IParams,
    @Body() body: DeleteComplaintDto,
  ) {
    return this.complaintAdminService.deleteComplaint(+params.id, body);
  }
}
